const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

loadDotEnv();

const publicDir = path.join(__dirname, "public");
const port = Number(process.env.PORT || 5173);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8"
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === "POST" && url.pathname === "/api/reading") {
      await handleReading(req, res);
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/status") {
      sendJson(res, 200, { hasServerKey: Boolean(process.env.GEMINI_API_KEY) });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/feedback") {
      await handleFeedback(req, res);
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/gpt-reading") {
      await handleGptReading(req, res);
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/admin/generate-code") {
      await handleGenerateCode(req, res);
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/admin/list") {
      await handleAdminList(req, res);
      return;
    }

    if (req.method !== "GET") {
      sendJson(res, 405, { error: "不支持的请求方式" });
      return;
    }

    const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;
    const filePath = path.normalize(path.join(publicDir, requestedPath));

    if (!filePath.startsWith(publicDir)) {
      sendJson(res, 403, { error: "禁止访问" });
      return;
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        sendJson(res, 404, { error: "找不到页面" });
        return;
      }

      const ext = path.extname(filePath);
      res.writeHead(200, {
        "Content-Type": mimeTypes[ext] || "application/octet-stream",
        "Cache-Control": "no-store"
      });
      res.end(data);
    });
  } catch (error) {
    sendJson(res, 500, { error: "服务器出错了" });
  }
});

server.listen(port, () => {
  console.log(`Neon Oracle Tarot is running at http://localhost:${port}`);
});

// ---------- Gemini（免费额度）----------

async function handleReading(req, res) {
  const body = await readBody(req);
  let payload;

  try {
    payload = JSON.parse(body);
  } catch {
    sendJson(res, 400, { error: "请求内容不是有效 JSON" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    sendJson(res, 200, {
      source: "local",
      text: buildLocalReading(payload)
    });
    return;
  }

  const prompt = buildGeminiPrompt(payload);
  const models = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-2.5-flash"];

  try {
    let lastError = "";

    for (const model of models) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
      const response = await fetch(`${endpoint}?key=${encodeURIComponent(apiKey)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.85,
            maxOutputTokens: 3000,
            thinkingConfig: { thinkingBudget: 0 }
          }
        })
      });

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.map((part) => part.text).join("\n").trim();
      const finishReason = data?.candidates?.[0]?.finishReason;

      if (response.ok && text) {
        sendJson(res, 200, {
          source: "gemini",
          model,
          text: finishReason === "MAX_TOKENS" ? `${text}\n\n（这次解读被输出长度截断了，可以重新抽牌或把问题问得更具体一点。）` : text
        });
        return;
      }

      lastError = data?.error?.message || `HTTP ${response.status}`;
    }

    sendJson(res, 200, {
      source: "local",
      text: buildLocalReading(payload, lastError)
    });
  } catch (error) {
    sendJson(res, 200, {
      source: "local",
      text: buildLocalReading(payload, "暂时无法连接 Gemini")
    });
  }
}

// ---------- 用户反馈（换免费次数）----------

async function handleFeedback(req, res) {
  const body = await readBody(req);
  let payload;

  try {
    payload = JSON.parse(body);
  } catch {
    sendJson(res, 400, { error: "请求内容不是有效 JSON" });
    return;
  }

  const text = String(payload?.text || "").trim().slice(0, 500);
  if (text.length <= 5) {
    sendJson(res, 400, { error: "反馈内容太短" });
    return;
  }

  try {
    await redis("LPUSH", "feedback:list", JSON.stringify({ text, ts: Date.now() }));
    await redis("LTRIM", "feedback:list", 0, 199);
    sendJson(res, 200, { ok: true });
  } catch (error) {
    sendJson(res, 500, { error: `保存反馈失败：${error.message}` });
  }
}

// ---------- GPT 付费解读（兑换码）----------

async function handleGptReading(req, res) {
  const body = await readBody(req);
  let payload;

  try {
    payload = JSON.parse(body);
  } catch {
    sendJson(res, 400, { error: "请求内容不是有效 JSON" });
    return;
  }

  const code = String(payload?.code || "").trim().toUpperCase();
  if (!code) {
    sendJson(res, 400, { error: "请输入兑换码" });
    return;
  }

  let remaining;
  try {
    const current = await redis("GET", `code:${code}`);
    if (current === null || current === undefined) {
      sendJson(res, 403, { error: "兑换码无效" });
      return;
    }
    if (Number(current) <= 0) {
      sendJson(res, 403, { error: "这个兑换码的次数已经用完了" });
      return;
    }
    remaining = await redis("DECR", `code:${code}`);
  } catch (error) {
    sendJson(res, 500, { error: `校验兑换码失败：${error.message}` });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    await redis("INCR", `code:${code}`).catch(() => {});
    sendJson(res, 500, { error: "服务器还没有配置 OpenAI API Key" });
    return;
  }

  const prompt = buildGeminiPrompt(payload);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.85,
        max_tokens: 1300
      })
    });

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    const finishReason = data?.choices?.[0]?.finish_reason;

    if (response.ok && text) {
      sendJson(res, 200, {
        source: "gpt",
        remaining,
        text: finishReason === "length" ? `${text}\n\n（这次解读被输出长度截断了，可以重新抽牌或把问题问得更具体一点。）` : text
      });
      return;
    }

    await redis("INCR", `code:${code}`).catch(() => {});
    sendJson(res, 500, { error: data?.error?.message || `HTTP ${response.status}` });
  } catch (error) {
    await redis("INCR", `code:${code}`).catch(() => {});
    sendJson(res, 500, { error: `暂时无法连接 OpenAI：${error.message}` });
  }
}

// ---------- 管理后台 ----------

async function handleGenerateCode(req, res) {
  const body = await readBody(req);
  let payload;

  try {
    payload = JSON.parse(body);
  } catch {
    sendJson(res, 400, { error: "请求内容不是有效 JSON" });
    return;
  }

  if (!process.env.ADMIN_PASSWORD || payload?.password !== process.env.ADMIN_PASSWORD) {
    sendJson(res, 403, { error: "密码不对" });
    return;
  }

  const uses = Math.max(1, Math.min(50, Number(payload?.uses) || 5));
  const code = generateCode();

  try {
    await redis("SET", `code:${code}`, uses);
    await redis("SADD", "codes:all", code);
    sendJson(res, 200, { code, uses });
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}

async function handleAdminList(req, res) {
  const body = await readBody(req);
  let payload;

  try {
    payload = JSON.parse(body);
  } catch {
    sendJson(res, 400, { error: "请求内容不是有效 JSON" });
    return;
  }

  if (!process.env.ADMIN_PASSWORD || payload?.password !== process.env.ADMIN_PASSWORD) {
    sendJson(res, 403, { error: "密码不对" });
    return;
  }

  try {
    const codeList = (await redis("SMEMBERS", "codes:all")) || [];
    const codes = [];
    for (const code of codeList) {
      const remaining = await redis("GET", `code:${code}`);
      codes.push({ code, remaining: Number(remaining) || 0 });
    }
    codes.sort((a, b) => b.remaining - a.remaining);

    const rawFeedback = (await redis("LRANGE", "feedback:list", 0, 49)) || [];
    const feedback = rawFeedback.map((item) => {
      try {
        return JSON.parse(item);
      } catch {
        return { text: item, ts: null };
      }
    });

    sendJson(res, 200, { codes, feedback });
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}

function generateCode() {
  return "TAROT-" + crypto.randomBytes(4).toString("hex").toUpperCase();
}

// ---------- Upstash Redis（REST API）----------

async function redis(...args) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error("缺少 UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN 环境变量");
  }

  const segments = args.map((part) => encodeURIComponent(String(part))).join("/");
  const response = await fetch(`${url}/${segments}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

// ---------- 通用 ----------

function buildGeminiPrompt(payload) {
  const question = String(payload?.question || "未填写具体问题").slice(0, 500);
  const spreadName = String(payload?.spreadName || "未知牌阵");
  const cards = Array.isArray(payload?.cards) ? payload.cards : [];
  const cardLines = cards
    .map((card, index) => {
      const position = card.position || `位置${index + 1}`;
      const orientation = card.reversed ? "逆位" : "正位";
      const meaning = card.reversed ? card.reversedMeaning : card.uprightMeaning;
      return `${index + 1}. ${position}：${card.cnName}（${card.name}，${orientation}）- ${meaning}`;
    })
    .join("\n");

  return [
    "你是一位温柔、清醒、偏现代心理视角的中文塔罗解读者。",
    "请把塔罗当作自我观察工具，不要做绝对预言，不要给医疗、法律、投资等高风险结论。",
    "输出中文，语气有画面感但不要玄乎过头。必须完整收尾，不要在句子中间结束。",
    "结构：先给一句核心答案，再给3段解释，最后给一个可执行的小建议。",
    `问题：${question}`,
    `牌阵：${spreadName}`,
    "抽到的牌：",
    cardLines || "暂无牌面"
  ].join("\n");
}

function buildLocalReading(payload, reason) {
  const question = String(payload?.question || "这个问题");
  const cards = Array.isArray(payload?.cards) ? payload.cards : [];
  const main = cards[0];
  const tension = cards.find((card) => card.reversed) || cards[1] || main;
  const finalCard = cards[cards.length - 1] || main;

  if (!main) {
    return "先写下问题并抽一组牌，我会根据牌阵给出解读。";
  }

  const reasonLine = reason ? `（AI 接口暂时不可用：${reason}，以下为本地基础解读。）\n\n` : "";
  return `${reasonLine}核心答案：这组牌更像是在提醒你先看清当下的情绪和真实需求，再决定下一步。

${main.position}的「${main.cnName}」显示，问题的起点与"${main.reversed ? main.reversedMeaning : main.uprightMeaning}"有关。它不一定代表结果已经固定，而是说明你现在最需要辨认的力量。

${tension && tension !== main ? `关键张「${tension.cnName}」带来的张力是：${tension.reversed ? tension.reversedMeaning : tension.uprightMeaning}。这部分可能是犹豫、误会、期待落差，或你没有说出口的担心。` : `这张牌的正逆位也提示你：别急着把答案推到极端，先观察事情哪里正在失衡。`}

走向上，「${finalCard.cnName}」建议你把注意力放回可行动的地方。今天可以先做一件小事：写下你真正想得到的回应，以及你能主动表达的一句话。`;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024 * 64) {
        req.destroy();
        reject(new Error("Body too large"));
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

function loadDotEnv() {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}