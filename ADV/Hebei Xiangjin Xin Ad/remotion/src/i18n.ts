// On-screen text localisation. Ad sets the language each render; tr() falls back to English.
let LANG: "en" | "zh" = "en";
export const setLang = (l: "en" | "zh") => { LANG = l; };
export const isZh = () => LANG === "zh";
const ZH: Record<string, string> = {
  "One factory. 15 product families.": "一家工厂 · 十五大产品系列",
  " / 15 product families · ": " / 15 大产品系列 · ",
  "Materials & strength grades": "材质与性能等级",
  "Grade": "等级",
  "Finishes": "表面处理",
  "Made to standard": "符合标准",
  "Here's how it works": "合作流程",
  "Order details": "订单详情",
  "Quantity": "数量",
  "Send your list or drawing": "发送清单或图纸",
  "Made to your exact specification": "按您的规格精确生产",
  "Packed & shipped": "包装发货",
  "M12 · 8.8 · HDG — to spec": "M12 · 8.8级 · 热镀锌 — 符合规格",
  "Hebei, China": "中国 · 河北",
  "USA": "美国",
  "Factory-direct to the ": "工厂直发",
  "From sample batch to mass production": "从小批样件到大批量生产",
  "pieces": "件",
  "Your one-stop fastener factory": "一站式紧固件工厂",
  "M2–M120 · GRADES 4.8–12.9 · ISO / DIN / GB": "M2–M120 · 性能等级 4.8–12.9 · ISO / DIN / GB",
  "Hex bolts": "六角头螺栓", "Flange & socket head bolts": "法兰面/内六角螺栓", "Nuts & lock nuts": "螺母与锁紧螺母",
  "Wing & cap nuts": "蝶形/盖型螺母", "Machine & self-tapping screws": "机螺钉与自攻钉", "Special bolts": "异型螺栓",
  "Threaded rod & U-bolts": "丝杆与U型螺栓", "Washers & retaining rings": "垫圈与挡圈", "Expansion & chemical anchors": "膨胀与化学锚栓",
  "Rivets & pins": "铆钉与销钉", "Self-drilling screws": "自攻钻尾钉", "Solar mounting parts": "光伏配套件",
  "Wire rope fittings": "钢丝绳夹与索具", "Pipe clamps & strut supports": "管夹与支吊架", "Custom parts": "非标定制件",
  "up to 3000 mm": "最长 3000 mm", "M2–M120 · to drawing": "M2–M120 · 按图定制",
  "Carbon steel": "碳钢", "Alloy steel": "合金钢", "304 stainless": "304 不锈钢", "316 stainless": "316 不锈钢",
  "Zinc": "镀锌", "Black oxide": "发黑", "Hot-dip galvanized": "热镀锌", "Dacromet": "达克罗",
  "Size": "规格", "Material": "材质", "Finish": "表面处理",
  "General industry": "通用工业", "Steel structures": "钢结构", "Solar": "光伏", "Electrical installation": "机电安装",
  "MADE BY": "MADE BY",
};
export const tr = (s: string) => (LANG === "zh" ? ZH[s] ?? s : s);
