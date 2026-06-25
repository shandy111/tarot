const spreads = [
  {
    id: "single",
    name: "单张牌",
    meaning: "用一张牌回答当下最核心的能量，适合快速提问。",
    layout: "single",
    positions: [pos("核心提示", 50, 50)]
  },
  {
    id: "three-time",
    name: "三张牌：过去 / 现在 / 未来",
    meaning: "观察事件的来处、当前状态和可能走向。",
    layout: "line",
    positions: [pos("过去", 28, 52), pos("现在", 50, 52), pos("未来", 72, 52)]
  },
  {
    id: "triangle",
    name: "圣三角：现状 / 阻碍 / 建议",
    meaning: "适合关系、选择和自我整理，重点看卡住的地方。",
    layout: "triangle",
    positions: [pos("现状", 50, 23), pos("阻碍", 35, 67), pos("建议", 65, 67)]
  },
  {
    id: "love",
    name: "关系五张",
    meaning: "看双方状态、关系动态、隐藏因素和下一步建议。",
    layout: "love",
    positions: [pos("你的状态", 25, 52), pos("对方状态", 75, 52), pos("关系动态", 50, 28), pos("隐藏因素", 50, 52), pos("建议", 50, 76)]
  },
  {
    id: "choice",
    name: "二选一牌阵",
    meaning: "比较两个选择的吸引力、代价与更稳妥的行动方式。",
    layout: "choice",
    positions: [pos("真实需求", 50, 22), pos("A可能", 25, 43), pos("A代价", 25, 70), pos("B可能", 75, 43), pos("B代价", 75, 70), pos("关键建议", 50, 55), pos("短期走向", 50, 82)]
  },
  {
    id: "horseshoe",
    name: "马蹄七张",
    meaning: "从过去、现在、隐藏影响到建议和结果，适合复杂问题。",
    layout: "horseshoe",
    positions: [pos("过去", 18, 72), pos("现在", 28, 43), pos("隐藏影响", 42, 25), pos("阻碍", 58, 25), pos("外部环境", 72, 43), pos("建议", 82, 72), pos("可能结果", 50, 78)]
  },
  {
    id: "year",
    name: "年度七张",
    meaning: "观察整体主题、上半年、下半年、需要放下、需要拥抱、隐藏课题和祝福。",
    layout: "year",
    positions: [pos("整体主题", 14, 50), pos("上半年", 28, 50), pos("下半年", 42, 50), pos("需放下", 56, 50), pos("需拥抱", 70, 50), pos("隐藏课题", 84, 50), pos("祝福", 50, 18)]
  },
  {
    id: "celtic",
    name: "凯尔特十字",
    meaning: "经典十张牌阵，适合看一个问题的根源、阻碍、意识、基础、过去、未来与外部影响。",
    layout: "celtic",
    positions: [pos("现状", 37, 50), pos("交叉阻碍", 37, 50, true), pos("显意识", 37, 18), pos("基础", 37, 82), pos("过去", 18, 50), pos("未来", 56, 50), pos("自我", 78, 82), pos("环境", 78, 60), pos("希望恐惧", 78, 38), pos("结果", 78, 16)]
  }
];

function pos(label, x, y, sideways = false) {
  return { label, x, y, sideways };
}

const majorArcana = [
  ["The Fool", "愚者", "新开始、冒险、自由感", "冲动、逃避现实、准备不足", "○"],
  ["The Magician", "魔术师", "行动力、资源整合、表达", "技巧误用、犹豫、空想", "I"],
  ["The High Priestess", "女祭司", "直觉、秘密、内在答案", "压抑直觉、信息不透明", "II"],
  ["The Empress", "皇后", "滋养、创造、丰盛", "过度付出、依赖舒适区", "III"],
  ["The Emperor", "皇帝", "秩序、边界、掌控", "僵硬、控制欲、权威压力", "IV"],
  ["The Hierophant", "教皇", "传统、承诺、学习", "旧规则束缚、盲从", "V"],
  ["The Lovers", "恋人", "吸引、选择、价值一致", "摇摆、关系失衡、逃避选择", "VI"],
  ["The Chariot", "战车", "推进、胜利、意志统一", "方向混乱、硬撑、失控", "VII"],
  ["Strength", "力量", "温柔的勇气、耐心、自控", "不自信、压抑本能、消耗", "VIII"],
  ["The Hermit", "隐者", "独处、反思、寻找答案", "孤立、过度退缩、拒绝帮助", "IX"],
  ["Wheel of Fortune", "命运之轮", "转机、周期变化、顺势", "停滞、反复、抗拒变化", "X"],
  ["Justice", "正义", "公平、因果、清晰判断", "偏见、失衡、逃避责任", "XI"],
  ["The Hanged Man", "倒吊人", "暂停、换角度、放下执念", "拖延、无谓牺牲、卡住", "XII"],
  ["Death", "死神", "结束、蜕变、清理旧物", "不愿结束、害怕改变", "XIII"],
  ["Temperance", "节制", "调和、恢复、恰到好处", "失衡、急躁、节奏紊乱", "XIV"],
  ["The Devil", "恶魔", "欲望、束缚、看见执念", "摆脱依附、诱惑减弱", "XV"],
  ["The Tower", "高塔", "突变、真相爆发、旧结构坍塌", "延迟爆发、拒绝面对问题", "XVI"],
  ["The Star", "星星", "希望、疗愈、重新相信", "信心不足、期待落空", "XVII"],
  ["The Moon", "月亮", "潜意识、迷雾、情绪波动", "真相浮现、恐惧减退", "XVIII"],
  ["The Sun", "太阳", "快乐、公开、成功", "迟来的喜悦、能量不足", "XIX"],
  ["Judgement", "审判", "觉醒、回应召唤、复盘", "自我否定、迟迟不决", "XX"],
  ["The World", "世界", "完成、整合、阶段圆满", "差最后一步、未完成感", "XXI"]
];

const suits = [
  {
    en: "Wands",
    cn: "权杖",
    glyph: "W",
    theme: "行动、热情、事业与创造力",
    upright: ["灵感萌发", "推进", "扩张", "庆祝", "竞争", "胜利", "坚持", "快速变化", "力量储备", "压力过载", "热情探索", "冲动表达", "主动领导", "愿景与成熟"],
    reversed: ["动力不足", "合作不稳", "延迟", "表面热闹", "内耗", "害怕被看见", "想放弃", "消息延迟", "自我怀疑", "负担松动", "方向飘忽", "急躁冒进", "控制过强", "热情失衡"]
  },
  {
    en: "Cups",
    cn: "圣杯",
    glyph: "C",
    theme: "情感、关系、直觉与疗愈",
    upright: ["情感开启", "互相靠近", "回忆与温柔", "重新评估", "失落", "善意流动", "幻想选择", "离开旧情绪", "满足", "幸福感", "心动表达", "浪漫想象", "成熟关怀", "深情稳定"],
    reversed: ["情绪闭合", "关系不对等", "困在过去", "错过机会", "从失落中恢复", "难以接受", "选择混乱", "不舍离开", "满足感下降", "家庭压力", "表达笨拙", "情绪化", "照顾过度", "情感压抑"]
  },
  {
    en: "Swords",
    cn: "宝剑",
    glyph: "S",
    theme: "思考、沟通、冲突与判断",
    upright: ["清晰想法", "艰难平衡", "心痛真相", "休息", "争执", "过渡", "策略隐藏", "限制感", "焦虑", "结束痛点", "好奇学习", "直接推进", "理性判断", "冷静权威"],
    reversed: ["想法混乱", "僵局松动", "伤口愈合", "过度停滞", "放下争胜", "难以过渡", "秘密暴露", "自我松绑", "焦虑缓解", "痛苦收尾", "言语冒失", "攻击性沟通", "过度挑剔", "冷漠疏离"]
  },
  {
    en: "Pentacles",
    cn: "星币",
    glyph: "P",
    theme: "现实、金钱、身体与长期建设",
    upright: ["现实机会", "资源平衡", "学习打磨", "稳定基础", "匮乏感", "给予与接受", "等待成果", "专注精进", "独立丰盛", "安全稳定", "认真学习", "稳步推进", "务实经营", "成熟掌握"],
    reversed: ["机会未落地", "失衡", "偷懒或返工", "守得太紧", "帮助将至", "交换不公", "急于求成", "完美主义", "依赖或空虚", "家庭财务压力", "拖延学习", "进展缓慢", "过度操心", "保守固执"]
  }
];

const minorNames = [
  ["Ace", "一"],
  ["Two", "二"],
  ["Three", "三"],
  ["Four", "四"],
  ["Five", "五"],
  ["Six", "六"],
  ["Seven", "七"],
  ["Eight", "八"],
  ["Nine", "九"],
  ["Ten", "十"],
  ["Page", "侍从"],
  ["Knight", "骑士"],
  ["Queen", "王后"],
  ["King", "国王"]
];

const majorFiles = [
  "RWS_Tarot_00_Fool.jpg",
  "RWS_Tarot_01_Magician.jpg",
  "RWS_Tarot_02_High_Priestess.jpg",
  "RWS_Tarot_03_Empress.jpg",
  "RWS_Tarot_04_Emperor.jpg",
  "RWS_Tarot_05_Hierophant.jpg",
  "RWS_Tarot_06_Lovers.jpg",
  "RWS_Tarot_07_Chariot.jpg",
  "RWS_Tarot_08_Strength.jpg",
  "RWS_Tarot_09_Hermit.jpg",
  "RWS_Tarot_10_Wheel_of_Fortune.jpg",
  "RWS_Tarot_11_Justice.jpg",
  "RWS_Tarot_12_Hanged_Man.jpg",
  "RWS_Tarot_13_Death.jpg",
  "RWS_Tarot_14_Temperance.jpg",
  "RWS_Tarot_15_Devil.jpg",
  "RWS_Tarot_16_Tower.jpg",
  "RWS_Tarot_17_Star.jpg",
  "RWS_Tarot_18_Moon.jpg",
  "RWS_Tarot_19_Sun.jpg",
  "RWS_Tarot_20_Judgement.jpg",
  "RWS_Tarot_21_World.jpg"
];

const minorFilePrefixes = {
  Wands: "Wands",
  Cups: "Cups",
  Swords: "Swords",
  Pentacles: "Pents"
};

function wikimediaImage(fileName) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}`;
}

const deck = [
  ...majorArcana.map(([name, cnName, uprightMeaning, reversedMeaning, glyph], index) => ({
    id: `major-${index}`,
    name,
    cnName,
    suit: "大阿尔卡那",
    glyph,
    image: wikimediaImage(majorFiles[index]),
    uprightMeaning,
    reversedMeaning,
    note: "大阿尔卡那通常代表更深层的主题、转折或心理课题。"
  })),
  ...suits.flatMap((suit) =>
    minorNames.map(([enRank, cnRank], index) => ({
      id: `${suit.en.toLowerCase()}-${index + 1}`,
      name: `${enRank} of ${suit.en}`,
      cnName: `${suit.cn}${cnRank}`,
      suit: suit.cn,
      glyph: suit.glyph,
      image: wikimediaImage(`${minorFilePrefixes[suit.en]}${String(index + 1).padStart(2, "0")}.jpg`),
      uprightMeaning: `${suit.upright[index]}，和${suit.theme}有关`,
      reversedMeaning: `${suit.reversed[index]}，提醒你重新调整${suit.theme}`,
      note: `小阿尔卡那的${suit.cn}更偏日常层面：${suit.theme}。`
    }))
  )
];

const spreadSelect = document.querySelector("#spreadSelect");
const spreadTabs = document.querySelector("#spreadTabs");
const drawButton = document.querySelector("#drawButton");
const apiKeyInput = document.querySelector("#apiKeyInput");
const questionInput = document.querySelector("#questionInput");
const spreadTitle = document.querySelector("#spreadTitle");
const spreadMeaning = document.querySelector("#spreadMeaning");
const cardStage = document.querySelector("#cardStage");
const selectedHint = document.querySelector("#selectedHint");
const cardMeaning = document.querySelector("#cardMeaning");
const aiReading = document.querySelector("#aiReading");
const aiSource = document.querySelector("#aiSource");

let currentCards = [];
let selectedCardId = null;

init();

function init() {
  apiKeyInput.value = localStorage.getItem("geminiApiKey") || "";
  apiKeyInput.addEventListener("change", () => {
    localStorage.setItem("geminiApiKey", apiKeyInput.value.trim());
  });
  detectServerKey();

  spreadSelect.innerHTML = spreads
    .map((spread) => `<option value="${spread.id}">${spread.name}</option>`)
    .join("");
  spreadTabs.innerHTML = spreads
    .map((spread) => `<button type="button" class="spread-tab" data-id="${spread.id}">${spread.name}</button>`)
    .join("");

  spreadTabs.querySelectorAll(".spread-tab").forEach((button) => {
    button.addEventListener("click", () => {
      spreadSelect.value = button.dataset.id;
      spreadSelect.dispatchEvent(new Event("change"));
    });
  });

  spreadSelect.addEventListener("change", () => {
    const spread = getSpread();
    spreadTabs.querySelectorAll(".spread-tab").forEach((button) => {
      button.classList.toggle("active", button.dataset.id === spread.id);
    });
    spreadTitle.textContent = spread.name;
    spreadMeaning.textContent = spread.meaning;
    currentCards = [];
    selectedCardId = null;
    selectedHint.textContent = "抽卡后点击牌面查看";
    cardMeaning.className = "meaning-content muted";
    cardMeaning.textContent = "问清楚自己真正想问的事，再抽牌。";
    aiReading.className = "ai-reading";
    aiReading.textContent = "抽卡后会结合你的问题给出一段完整解读。";
    aiSource.textContent = "Gemini / 本地备用";
    drawButton.textContent = "抽牌";
    renderEmptyDeck();
  });

  drawButton.addEventListener("click", drawCards);
  spreadSelect.dispatchEvent(new Event("change"));
}

async function detectServerKey() {
  if (location.protocol === "file:") return;

  try {
    const response = await fetch("/api/status");
    const data = await response.json();
    if (data.hasServerKey) {
      apiKeyInput.value = "";
      apiKeyInput.hidden = true;
      localStorage.removeItem("geminiApiKey");
    }
  } catch {
    // Local static mode keeps the input visible.
  }
}

function getSpread() {
  return spreads.find((spread) => spread.id === spreadSelect.value) || spreads[0];
}

function renderEmptyDeck() {
  const spread = getSpread();
  cardStage.className = `card-stage layout-${spread.layout} count-${Math.min(spread.positions.length, 10)}`;
  cardStage.innerHTML = spread.positions
    .map(
      (position) => `
      <button class="tarot-card placeholder${position.sideways ? " sideways" : ""}" type="button" aria-label="${position.label}" style="${cardPositionStyle(position, 0)}">
        <span class="tarot-card-inner">
          <span class="card-face card-back"><span class="back-star">✦</span></span>
          <span class="card-face card-front">
            <span class="card-top"><span class="card-name">等待抽牌</span><span class="orientation">?</span></span>
            <span class="card-art"><span class="glyph">?</span></span>
            <span class="card-bottom"><span class="position-chip">${position.label}</span></span>
          </span>
        </span>
      </button>`
    )
    .join("");
}

async function drawCards() {
  const spread = getSpread();
  selectedCardId = null;
  drawButton.disabled = true;
  drawButton.textContent = "洗牌中";
  cardMeaning.className = "meaning-content muted";
  cardMeaning.textContent = "牌面正在翻开。";
  aiReading.className = "ai-reading loading";
  aiReading.textContent = "等待牌阵稳定后开始解读。";
  aiSource.textContent = "准备中";

  currentCards = shuffle(deck)
    .slice(0, spread.positions.length)
    .map((card, index) => ({
      ...card,
      position: spread.positions[index].label,
      spreadPoint: spread.positions[index],
      reversed: Math.random() > 0.5
    }));

  renderCards(false);

  window.setTimeout(() => {
    renderCards(true);
    selectCard(currentCards[0].id);
    requestAiReading();
    drawButton.disabled = false;
    drawButton.textContent = "重新抽牌";
  }, 420);
}

function renderCards(revealed) {
  const spread = getSpread();
  const countClass = currentCards.length > 0 ? Math.min(currentCards.length, 10) : 1;
  cardStage.className = `card-stage layout-${spread.layout} count-${countClass}`;
  cardStage.innerHTML = currentCards
    .map((card, index) => {
      const selected = card.id === selectedCardId ? " selected" : "";
      const reverseClass = card.reversed ? " reversed" : "";
      const revealClass = revealed ? " revealed" : "";
      const sidewaysClass = card.spreadPoint?.sideways ? " sideways" : "";
      return `
        <button
          class="tarot-card${selected}${reverseClass}${revealClass}${sidewaysClass}"
          type="button"
          style="${cardPositionStyle(card.spreadPoint, index)}"
          aria-label="${card.position} ${card.cnName}"
          data-id="${card.id}"
        >
          <span class="tarot-card-inner">
            <span class="card-face card-back"><span class="back-star">✦</span></span>
            <span class="card-face card-front">
              <span class="card-image-wrap">
                <img class="card-image" src="${card.image}" alt="${card.cnName}" loading="lazy" onerror="this.classList.add('is-missing')" />
                <span class="glyph fallback-glyph">${card.glyph}</span>
              </span>
              <span class="card-caption">
                <span class="card-name">${card.cnName}</span>
                <span class="orientation">${card.reversed ? "逆" : "正"}</span>
                <span class="position-chip">${card.position}</span>
              </span>
            </span>
          </span>
        </button>
      `;
    })
    .join("");

  cardStage.querySelectorAll(".tarot-card").forEach((button) => {
    button.addEventListener("click", () => selectCard(button.dataset.id));
  });
}

function cardPositionStyle(position, index) {
  const point = position || pos("牌位", 50, 50);
  return `--x:${point.x}; --y:${point.y}; --delay:${index * 70}ms;`;
}

function selectCard(cardId) {
  const card = currentCards.find((item) => item.id === cardId);
  if (!card) return;

  selectedCardId = cardId;
  renderCards(true);
  selectedHint.textContent = `${card.position} · ${card.reversed ? "逆位" : "正位"}`;
  cardMeaning.className = "meaning-content";
  cardMeaning.innerHTML = `
    <strong>${card.position}：${card.cnName}（${card.name}）</strong><br>
    牌组：${card.suit}。${card.note}<br>
    ${card.reversed ? "逆位" : "正位"}含义：${card.reversed ? card.reversedMeaning : card.uprightMeaning}。
  `;
}

async function requestAiReading() {
  const spread = getSpread();
  const payload = {
    question: questionInput.value.trim(),
    spreadName: spread.name,
    spreadMeaning: spread.meaning,
    cards: currentCards.map((card) => ({
      name: card.name,
      cnName: card.cnName,
      position: card.position,
      reversed: card.reversed,
      uprightMeaning: card.uprightMeaning,
      reversedMeaning: card.reversedMeaning
    }))
  };

  aiReading.className = "ai-reading loading";
  aiReading.textContent = "正在连接星盘线路，给这组牌组织语言。";
  aiSource.textContent = "解读中";

  try {
    const data = await requestReading(payload);
    aiReading.className = "ai-reading";
    aiReading.textContent = data.text || "暂时没有生成解读，请重新抽牌试试。";
    aiSource.textContent = data.source === "gemini" ? "Gemini" : data.source === "browser-gemini" ? "Gemini 浏览器直连" : "本地备用";
  } catch {
    aiReading.className = "ai-reading";
    aiReading.textContent = "AI 暂时没有响应。可以检查 Gemini API Key 是否正确，或稍后重新抽牌。";
    aiSource.textContent = "连接失败";
  }
}

async function requestReading(payload) {
  const apiKey = apiKeyInput.value.trim();

  if (apiKey) {
    return requestBrowserGemini(payload, apiKey);
  }

  if (location.protocol !== "file:") {
    try {
      const response = await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (response.ok) return response.json();
    } catch {
      // Fall through to browser Gemini mode.
    }
  }

  return {
    source: "local",
    text: "想要 AI 针对你的问题解读，需要先在右上角填 Gemini API Key。没有 Key 时，我只能给出基础牌义解读。"
  };
}

async function requestBrowserGemini(payload, apiKey) {
  localStorage.setItem("geminiApiKey", apiKey);
  const models = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-2.5-flash"];
  let lastMessage = "";
  let lastStatus = "";

  for (const model of models) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    try {
      const response = await fetchWithTimeout(`${endpoint}?key=${encodeURIComponent(apiKey)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildBrowserPrompt(payload) }] }],
        generationConfig: {
          temperature: 0.85,
          maxOutputTokens: 1300
        }
      })
      });
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.map((part) => part.text).join("\n").trim();
      const finishReason = data?.candidates?.[0]?.finishReason;

      if (response.ok && text) {
        return {
          source: "browser-gemini",
          model,
          text: finishReason === "MAX_TOKENS" ? `${text}\n\n（这次解读被输出长度截断了，可以重新抽牌或把问题问得更具体一点。）` : text
        };
      }

      lastMessage = data?.error?.message || `HTTP ${response.status}`;
      lastStatus = data?.error?.status ? `（${data.error.status}）` : "";
    } catch (error) {
      lastMessage = error.name === "AbortError" ? "请求超时，浏览器直连 Gemini 没有响应" : error.message;
      lastStatus = "";
    }
  }

  return {
    source: "local",
    text: `Gemini 没有成功返回：${lastMessage}${lastStatus}\n\n如果这里出现 RESOURCE_EXHAUSTED，一般是额度或频率限制；如果是 API_KEY_INVALID，是密钥问题；如果是 model not found，是模型名不可用。\n\n${buildLocalBrowserReading(payload)}`
  };
}

function fetchWithTimeout(url, options, timeout = 12000) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeout);

  return fetch(url, {
    ...options,
    signal: controller.signal
  }).finally(() => window.clearTimeout(timer));
}

function buildBrowserPrompt(payload) {
  const question = payload.question || "未填写具体问题";
  const cardLines = payload.cards
    .map((card, index) => {
      const orientation = card.reversed ? "逆位" : "正位";
      const meaning = card.reversed ? card.reversedMeaning : card.uprightMeaning;
      return `${index + 1}. ${card.position}：${card.cnName}（${card.name}，${orientation}）- ${meaning}`;
    })
    .join("\n");

  return [
    "你是一位温柔、清醒、偏现代心理视角的中文塔罗解读者。",
    "必须紧扣用户的问题，不要只解释牌义。不要做绝对预言，不要提供医疗、法律、投资等高风险结论。",
    "输出结构：一句核心答案；然后按牌阵位置逐张解释它如何回应问题；最后给一个现实可执行建议。必须完整收尾，不要在句子中间结束。",
    `用户问题：${question}`,
    `牌阵：${payload.spreadName}`,
    `牌阵含义：${payload.spreadMeaning}`,
    "抽到的牌：",
    cardLines
  ].join("\n");
}

function buildLocalBrowserReading(payload) {
  const question = payload.question || "这个问题";
  const cards = payload.cards || [];
  const first = cards[0];
  const last = cards[cards.length - 1] || first;
  if (!first) return "请先抽牌。";

  return `基础解读：围绕“${question}”，这组牌提示你先看清自己真正想要什么。${first.position}的「${first.cnName}」说明起点在于${first.reversed ? first.reversedMeaning : first.uprightMeaning}；最后的「${last.cnName}」则建议你把注意力放在${last.reversed ? last.reversedMeaning : last.uprightMeaning}。`;
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}
