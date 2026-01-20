import { LevelData } from './types';

export const TOTAL_DEPTH = 3000;

export const LEVELS: LevelData[] = [
  {
    id: 0,
    depth: 0,
    title: "洞口",
    description: "阳光依然眷顾着长满苔藓的岩石。空气温暖，混合着松脂和湿泥土的气息。你正站在未知的边缘，凝视着通往地底的入口。",
    backgroundColor: "#1a2e1a", // Deep Green
    accentColor: "#4ade80", // Green 400
    textColor: "#f0fdf4",
    opacity: 0,
    icon: "sun"
  },
  {
    id: 1,
    depth: 150,
    title: "暮光区",
    description: "光线褪成了沉闷的灰色。气温骤降。回声开始变得扭曲。岩壁上凝结着冷凝水，触感湿滑冰冷。",
    backgroundColor: "#1e293b", // Slate 800
    accentColor: "#94a3b8", // Slate 400
    textColor: "#e2e8f0",
    opacity: 0.3,
    icon: "cloud"
  },
  {
    id: 2,
    depth: 500,
    title: "垂直深渊",
    description: "绝对的黑暗。重力似乎在这里变得更加沉重。死一般的寂静，只有你自己剧烈的心跳声在耳边回荡。",
    backgroundColor: "#020617", // Slate 950
    accentColor: "#3b82f6", // Blue 500
    textColor: "#f8fafc",
    opacity: 0.8,
    icon: "arrow-down"
  },
  {
    id: 3,
    depth: 1200,
    title: "水晶穹顶",
    description: "生物发光的真菌攀附在巨大的晶洞构造上。洞穴豁然开朗，化作一座闪烁着紫色微光的石英大教堂。",
    backgroundColor: "#2e1065", // Violet 950
    accentColor: "#d8b4fe", // Violet 300
    textColor: "#faf5ff",
    opacity: 0.6,
    icon: "diamond"
  },
  {
    id: 4,
    depth: 2100,
    title: "地下暗河",
    description: "漆黑如墨的急流切开岩石，咆哮而过。它以不可思议的速度奔涌向前，仿佛要把一切带往地心深处。",
    backgroundColor: "#082f49", // Sky 950
    accentColor: "#0ea5e9", // Sky 500
    textColor: "#f0f9ff",
    opacity: 0.7,
    icon: "waves"
  },
  {
    id: 5,
    depth: 3000,
    title: "地核边界",
    description: "热浪翻涌。这里的岩石仿佛在呼吸。你已抵达底部，但感觉似乎某种古老的存在正在黑暗中注视着你。",
    backgroundColor: "#450a0a", // Red 950
    accentColor: "#f87171", // Red 400
    textColor: "#fef2f2",
    opacity: 0.5,
    icon: "flame"
  }
];