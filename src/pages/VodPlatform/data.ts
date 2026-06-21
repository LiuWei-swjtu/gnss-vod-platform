export type NavKey = "home" | "stations" | "trend" | "snr" | "sky" | "history";

export const navItems: Array<{ key: NavKey; label: string; icon: string; path: string }> = [
  { key: "home", label: "首页", icon: "⌂", path: "/" },
  { key: "stations", label: "全球站点", icon: "◎", path: "/stations" },
  { key: "trend", label: "趋势分析", icon: "▧", path: "/trend" },
  { key: "snr", label: "监测数据", icon: "▥", path: "/snr" },
  { key: "sky", label: "卫星天空", icon: "✦", path: "/sky" },
  { key: "history", label: "历史查询", icon: "▤", path: "/history" },
];

export const stationCards = [
  { code: "BJFS", name: "北京房山", value: 0.842, delta: "+0.028", status: "正常", color: "#22b7ff" },
  { code: "XIAN", name: "西安长安", value: 0.615, delta: "+0.012", status: "正常", color: "#4ed85d" },
  { code: "NMGH", name: "内蒙古呼和浩特", value: 0.487, delta: "-0.018", status: "正常", color: "#22d7e8" },
  { code: "LZCH", name: "兰州城关", value: 0.372, delta: "+0.009", status: "正常", color: "#2688ff" },
  { code: "URUM", name: "乌鲁木齐", value: 0.295, delta: "-0.021", status: "正常", color: "#1689ff" },
  { code: "HLUN", name: "哈尔滨", value: 0.531, delta: "+0.015", status: "正常", color: "#38aaff" },
];

export const miniTrends = [
  [0.82, 0.76, 0.91, 0.88, 0.7, 0.72, 0.95, 0.93, 0.87, 0.99, 1.05, 1.12],
  [0.66, 0.78, 0.69, 0.63, 0.7, 0.64, 0.91, 0.88, 0.86, 0.74, 0.69, 0.63],
  [0.64, 0.74, 0.65, 0.56, 0.62, 0.6, 0.75, 0.83, 0.72, 0.68, 0.64, 0.61],
  [0.58, 0.7, 0.55, 0.6, 0.52, 0.67, 0.61, 0.78, 0.62, 0.71, 0.63, 0.66],
  [0.61, 0.56, 0.63, 0.49, 0.55, 0.51, 0.57, 0.45, 0.52, 0.48, 0.5, 0.46],
  [0.74, 0.63, 0.78, 0.82, 0.76, 0.65, 0.69, 0.88, 0.98, 1.02, 1.15, 1.06],
];

export const alerts = [
  { level: "紧急", title: "SNR信噪比骤降", station: "URUM 乌鲁木齐", time: "2025-05-26 14:25:00", note: "SNR平均值从 38.6 dB-Hz 骤降至 22.1 dB-Hz" },
  { level: "重要", title: "VOD值异常波动", station: "NMGH 呼和浩特", time: "2025-05-26 14:20:00", note: "15分钟内波动超过阈值 ±0.15" },
  { level: "一般", title: "数据延迟偏高", station: "BJFS 北京房山", time: "2025-05-26 14:10:00", note: "链路延迟高于稳定阈值" },
  { level: "一般", title: "卫星数减少", station: "LZCH 兰州城关", time: "2025-05-26 14:05:00", note: "可见卫星短时减少" },
];

export const weatherCards = [
  { city: "北京", icon: "☁", text: "多云", temp: "24/13°C", wind: "北风 2级" },
  { city: "西安", icon: "☀", text: "晴", temp: "28/16°C", wind: "东风 2级" },
  { city: "呼和浩特", icon: "⛅", text: "多云", temp: "21/10°C", wind: "西北风 3级" },
  { city: "乌鲁木齐", icon: "☀", text: "晴", temp: "27/14°C", wind: "西风 3级" },
  { city: "哈尔滨", icon: "🌧", text: "小雨", temp: "18/8°C", wind: "东北风 2级" },
];

export const worldStations = [
  { code: "BJFS", name: "北京房山", x: 77, y: 40, value: "0.842", status: "online", size: 22 },
  { code: "XIAN", name: "西安长安", x: 73, y: 46, value: "0.615", status: "online", size: 17 },
  { code: "USNO", name: "美国华盛顿", x: 24, y: 42, value: "0.451", status: "online", size: 18 },
  { code: "WSRT", name: "荷兰韦斯特伯克", x: 49, y: 34, value: "0.272", status: "online", size: 15 },
  { code: "NAIR", name: "肯尼亚内罗毕", x: 53, y: 62, value: "0.328", status: "offline", size: 17 },
  { code: "BRAZ", name: "巴西圣保罗", x: 34, y: 74, value: "0.381", status: "offline", size: 19 },
  { code: "PERI", name: "澳大利亚珀斯", x: 77, y: 71, value: "0.267", status: "online", size: 16 },
  { code: "YAR2", name: "俄罗斯新西伯利亚", x: 63, y: 31, value: "0.318", status: "offline", size: 14 },
];

export const snrRows = [
  ["G", "G07", "15", "28.6", "25.1", "26.3", "良"],
  ["G", "G12", "22", "31.4", "27.9", "28.8", "良"],
  ["G", "G15", "35", "43.7", "39.5", "40.1", "优"],
  ["G", "G18", "48", "47.9", "43.8", "44.2", "优"],
  ["G", "G21", "62", "49.1", "45.0", "46.2", "优"],
  ["C", "C03", "18", "30.2", "26.4", "27.1", "良"],
  ["C", "C07", "29", "38.5", "33.6", "34.2", "良"],
  ["C", "C11", "41", "45.3", "40.1", "41.5", "优"],
  ["E", "E19", "57", "48.6", "43.7", "44.5", "优"],
];

export const historyRows = [
  ["2025-05-26 14:30:00", "BJFS 北京房山", "G07 (007)", "L1/E1", "0.842", "36.2", "正常", "2025-05-26 14:30:05"],
  ["2025-05-26 14:30:00", "XIAN 西安长安", "R09 (009)", "L1/E1", "0.615", "28.7", "正常", "2025-05-26 14:30:05"],
  ["2025-05-26 14:30:00", "NMGH 内蒙古呼和浩特", "G23 (023)", "L5/E5a", "0.487", "31.9", "正常", "2025-05-26 14:30:05"],
  ["2025-05-26 14:30:00", "LZCH 兰州城关", "R16 (016)", "L1/E1", "0.372", "22.4", "正常", "2025-05-26 14:30:05"],
  ["2025-05-26 14:30:00", "URUM 乌鲁木齐", "E11 (011)", "E1/E5b", "0.295", "24.1", "正常", "2025-05-26 14:30:05"],
  ["2025-05-26 14:30:00", "HLUN 哈尔滨", "C06 (006)", "L1/B1I", "0.531", "34.6", "正常", "2025-05-26 14:30:05"],
  ["2025-05-26 14:28:00", "BJFS 北京房山", "G07 (007)", "L1/E1", "0.828", "35.9", "正常", "2025-05-26 14:28:05"],
  ["2025-05-26 14:28:00", "XIAN 西安长安", "R09 (009)", "L1/E1", "0.608", "28.3", "正常", "2025-05-26 14:28:05"],
  ["2025-05-26 14:28:00", "NMGH 内蒙古呼和浩特", "G23 (023)", "L5/E5a", "0.481", "31.6", "正常", "2025-05-26 14:28:05"],
  ["2025-05-26 14:28:00", "LZCH 兰州城关", "R16 (016)", "L1/E1", "0.368", "22.1", "异常", "2025-05-26 14:28:05"],
];

export const skySatellites = [
  { id: "G07", system: "GPS", x: 51, y: 15, color: "#1f9cff" },
  { id: "G18", system: "GPS", x: 26, y: 28, color: "#1f9cff" },
  { id: "G05", system: "GPS", x: 15, y: 36, color: "#1f9cff" },
  { id: "G21", system: "GPS", x: 81, y: 35, color: "#1f9cff" },
  { id: "G02", system: "GPS", x: 29, y: 72, color: "#1f9cff" },
  { id: "G33", system: "GPS", x: 28, y: 65, color: "#1f9cff" },
  { id: "R08", system: "GLONASS", x: 57, y: 18, color: "#31d75b" },
  { id: "R14", system: "GLONASS", x: 34, y: 32, color: "#31d75b" },
  { id: "R21", system: "GLONASS", x: 33, y: 45, color: "#31d75b" },
  { id: "R16", system: "GLONASS", x: 48, y: 57, color: "#31d75b" },
  { id: "E12", system: "Galileo", x: 43, y: 34, color: "#a267ff" },
  { id: "E24", system: "Galileo", x: 75, y: 36, color: "#a267ff" },
  { id: "E31", system: "Galileo", x: 23, y: 43, color: "#a267ff" },
  { id: "E04", system: "Galileo", x: 35, y: 53, color: "#a267ff" },
  { id: "C10", system: "北斗", x: 62, y: 34, color: "#ffad20" },
  { id: "C30", system: "北斗", x: 83, y: 35, color: "#ffad20" },
  { id: "C18", system: "北斗", x: 77, y: 50, color: "#ffad20" },
  { id: "C25", system: "北斗", x: 79, y: 58, color: "#ffad20" },
  { id: "C15", system: "北斗", x: 19, y: 67, color: "#ffad20" },
];
