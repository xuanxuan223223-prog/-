import { GoogleGenAI, Type } from "@google/genai";
import { StoryScene, GameState, LevelData, AnalysisResult } from "../types";

const createClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is not set.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Initial state for a new game
export const getInitialScene = (): StoryScene => ({
  id: 'start',
  title: '地狱之口',
  description: '你站在巨大的地下空洞边缘。冷风从下方吹来，带着硫磺和未知的腐败气味。你的探险装备运行正常，但深渊的黑暗仿佛有生命般凝视着你。你的任务是深入地底，寻找传说中的“深网核心”，或者……仅仅是活下去。',
  depth: 0,
  choices: [
    { id: 'c1', text: '开启头灯，开始绳降', type: 'move' },
    { id: 'c2', text: '先投掷照明弹侦查深处', type: 'action' },
    { id: 'c3', text: '检查通讯设备', type: 'action' }
  ],
  colorHex: '#1a2e1a',
  icon: 'sun',
  healthChange: 0,
  sanityChange: 0,
  isGameOver: false,
  isWin: false
});

export const continueStory = async (
  currentScene: StoryScene, 
  choiceText: string, 
  currentStats: { health: number, sanity: number, depth: number }
): Promise<StoryScene> => {
  const ai = createClient();
  
  if (!ai) {
    return {
      ...currentScene,
      id: `err-${Date.now()}`,
      title: "系统错误",
      description: "未检测到神经连接（API Key缺失）。无法生成现实模拟。请检查环境变量配置。",
      choices: [],
      isGameOver: true,
      isWin: false
    };
  }

  const systemInstruction = `
    你是一个硬科幻/克苏鲁风格的文字冒险游戏（Dungeon Master）。
    你的任务是根据玩家的选择推进剧情，生成下一个场景。

    【规则】
    1. 剧情需连贯，描述要有沉浸感、压迫感，类似于《深渊(The Abyss)》或《普罗米修斯》。
    2. 如果深度超过3000米，玩家可能找到“深网核心”并获胜，或者遭遇最终恐惧（Game Over）。
    3. 如果玩家选择向上逃离且深度回到0，则逃生成功（胜利）。
    4. 根据玩家选择判定后果：
       - 危险行为可能扣除生命值。
       - 恐怖景象或精神污染扣除理智值。
       - 通常情况下深度会增加（深入），除非玩家明确选择往上爬。
    5. 返回3个不同的选择（choices）：
       - move: 推进剧情/深入/移动
       - action: 调查/使用物品/互动
       - risk: 高风险高回报或鲁莽行为
    6. 严禁使用Markdown代码块，直接返回纯JSON。
  `;

  const prompt = `
    【当前状态】
    - 深度: ${currentStats.depth}米
    - 生命值: ${currentStats.health}
    - 理智值: ${currentStats.sanity}
    - 上一场景: "${currentScene.description}"
    - 玩家选择: "${choiceText}"

    请生成下一个场景的JSON数据，包含 title, description, depth, healthChange, sanityChange, colorHex, icon, isGameOver, isWin, choices。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            depth: { type: Type.NUMBER },
            healthChange: { type: Type.NUMBER },
            sanityChange: { type: Type.NUMBER },
            colorHex: { type: Type.STRING },
            icon: { type: Type.STRING },
            isGameOver: { type: Type.BOOLEAN },
            isWin: { type: Type.BOOLEAN },
            choices: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  text: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["move", "action", "risk"] }
                }
              }
            }
          }
        }
      }
    });

    let text = response.text;
    if (!text) throw new Error("Empty response from AI");

    // Clean up markdown if present (e.g. ```json ... ```)
    text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    
    const data = JSON.parse(text);

    return {
      id: `scene-${Date.now()}`,
      ...data
    };

  } catch (error) {
    console.error("Story generation failed", error);
    return {
      id: `err-${Date.now()}`,
      title: "连接中断",
      description: "虽然你的意识依然清醒，但周围的现实开始崩塌。AI叙事模块发生致命错误，无法解析下一步的量子状态。",
      depth: currentStats.depth,
      healthChange: 0,
      sanityChange: 0,
      colorHex: "#220000",
      icon: "alert-triangle",
      isGameOver: true,
      isWin: false,
      choices: []
    };
  }
};

export const analyzeEnvironment = async (level: LevelData): Promise<AnalysisResult> => {
  // Keeping this for compatibility, though currently unused in main game loop
  const ai = createClient();
  
  if (!ai) {
    return {
      scanId: `err-${Date.now()}`,
      composition: "系统离线",
      dangerLevel: "未知",
      note: "无法连接到分析模块。"
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `扫描区域: ${level.title}。请返回JSON: {composition, dangerLevel, note}`,
      config: { responseMimeType: "application/json" }
    });
    
    const text = response.text?.replace(/^```json\s*/, '').replace(/\s*```$/, '') || "{}";
    const data = JSON.parse(text);
    return {
      scanId: `scan-${Date.now()}`,
      composition: data.composition || "未知",
      dangerLevel: data.dangerLevel || "未知",
      note: data.note || "无法解析数据"
    };
  } catch (e) {
    return { scanId: 'err', composition: 'Error', dangerLevel: 'Error', note: 'Scan failed' };
  }
};