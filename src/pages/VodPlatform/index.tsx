import { Link } from "react-router";
import type { CSSProperties, ReactNode } from "react";
import type { EChartsOption } from "echarts";
import { BarChart, GaugeChart, LineChart, PieChart, ScatterChart } from "echarts/charts";
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  MarkAreaComponent,
  MarkPointComponent,
  TooltipComponent,
} from "echarts/components";
import Chart from "@/components/chart";
import {
  alerts,
  historyRows,
  miniTrends,
  navItems,
  skySatellites,
  snrRows,
  stationCards,
  weatherCards,
  worldStations,
  type NavKey,
} from "./data";
import "./styles.css";

const chartUse = [
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  GaugeChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  DataZoomComponent,
  MarkAreaComponent,
  MarkPointComponent,
];

const axisStyle = {
  axisLine: { lineStyle: { color: "rgba(146, 190, 231, 0.42)" } },
  axisLabel: { color: "#8fb5d8" },
  splitLine: { lineStyle: { color: "rgba(74, 141, 198, 0.18)" } },
};

function DataChart({ option }: { option: EChartsOption }) {
  return <Chart option={option} use={chartUse} />;
}

function Shell({
  active,
  title = "GNSS-VOD 实时监测平台",
  page,
  children,
}: {
  active: NavKey;
  title?: string;
  page: number;
  children: ReactNode;
}) {
  return (
    <div className="vod-screen">
      <header className="vod-header">
        <div className="brand-mark">◈</div>
        <div className="brand-title">{title}</div>
        <nav className="vod-nav">
          {navItems.map((item) => (
            <Link key={item.key} className={`nav-tab ${active === item.key ? "active" : ""}`} to={item.path}>
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="clock-block">
          <strong>14:32:45</strong>
          <span>2025-05-26<br />星期一</span>
        </div>
      </header>
      <main className="vod-content">{children}</main>
      <footer className="vod-footer">
        <span>数据来源：GNSS-VOD 监测网络</span>
        <span>投影坐标系：WGS84</span>
        <span>页面编号：{page} / 6</span>
        <span>© 2025 GNSS-VOD 实时监测平台</span>
      </footer>
    </div>
  );
}

function Panel({
  title,
  extra,
  className = "",
  children,
}: {
  title?: string;
  extra?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`panel ${className}`}>
      {title ? (
        <div className="panel-title">
          <span>{title}</span>
          {extra}
        </div>
      ) : null}
      <div className="panel-body">{children}</div>
    </section>
  );
}

function MetricCard({
  icon,
  label,
  value,
  sub,
  accent = "#26c8ff",
  bars = false,
}: {
  icon: string;
  label: string;
  value: string;
  sub: string;
  accent?: string;
  bars?: boolean;
}) {
  return (
    <div className="metric-card">
      <div className="metric-icon" style={{ color: accent }}>
        {icon}
      </div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <em>{sub}</em>
      </div>
      {bars ? <MiniBars /> : null}
    </div>
  );
}

function SelectPill({ label, wide = false }: { label: string; wide?: boolean }) {
  return <button className={`select-pill ${wide ? "wide" : ""}`}>{label}<span>⌄</span></button>;
}

function StatusDot({ tone = "green" }: { tone?: "green" | "red" | "gray" | "orange" }) {
  return <i className={`status-dot ${tone}`} />;
}

function MiniBars() {
  return (
    <div className="mini-bars">
      {Array.from({ length: 32 }, (_, index) => (
        <span key={index} style={{ height: `${18 + ((index * 11) % 38)}px` }} />
      ))}
    </div>
  );
}

function Sparkline({ data, color = "#24c8ff" }: { data: number[]; color?: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = Math.max(max - min, 0.01);
  const points = data
    .map((value, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * 100;
      const y = 78 - ((value - min) / span) * 56;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg className="sparkline" viewBox="0 0 100 86" preserveAspectRatio="none">
      <path d="M0 80H100" />
      <path d="M0 54H100" />
      <path d="M0 28H100" />
      <polyline points={points} style={{ stroke: color }} />
      <polygon points={`0,82 ${points} 100,82`} style={{ fill: color }} />
    </svg>
  );
}

function GaugeCard({ station, index }: { station: (typeof stationCards)[number]; index: number }) {
  const pct = Math.min(station.value / 1.2, 1);
  return (
    <div className="gauge-card">
      <div className="gauge-heading">
        <strong>{station.code}</strong>
        <span>{station.name}</span>
      </div>
      <div className="semi-gauge" style={{ "--gauge": `${pct * 180}deg`, "--gauge-color": station.color } as CSSProperties}>
        <span>{station.value.toFixed(3)}</span>
        <small>VOD</small>
      </div>
      <div className="gauge-meta">
        <span>较昨日</span>
        <b className={station.delta.startsWith("-") ? "danger" : "good"}>{station.delta}</b>
      </div>
      <div className="gauge-meta">
        <span>状态</span>
        <b className="good">● {station.status}</b>
      </div>
      <div className="gauge-scale">{index % 2 === 0 ? "0.5" : "0.3"}<span>1</span><em>2.15</em></div>
    </div>
  );
}

function lineOption(data: number[], color = "#24c8ff", smooth = true): EChartsOption {
  return {
    grid: { left: 32, right: 12, top: 12, bottom: 24 },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: data.map((_, i) => `${i}`), ...axisStyle, axisLabel: { color: "#88a9c9", showMaxLabel: true } },
    yAxis: { type: "value", min: 0, max: 1.25, ...axisStyle },
    series: [
      {
        type: "line",
        data,
        smooth,
        symbol: "none",
        lineStyle: { color, width: 2 },
        areaStyle: { color: `${color}22` },
      },
    ],
  };
}

function donutOption(values: Array<{ value: number; name: string }>, colors: string[]): EChartsOption {
  return {
    color: colors,
    tooltip: { trigger: "item" },
    legend: { orient: "vertical", right: 0, top: "center", textStyle: { color: "#b9d7ef" } },
    series: [
      {
        type: "pie",
        radius: ["48%", "72%"],
        center: ["34%", "50%"],
        label: { show: false },
        data: values,
      },
    ],
  };
}

function stationDonutOption(): EChartsOption {
  return donutOption([
    { name: "亚洲 36.5%", value: 58 },
    { name: "欧洲 22.6%", value: 36 },
    { name: "北美洲 17.6%", value: 28 },
    { name: "南美洲 8.8%", value: 14 },
    { name: "非洲 8.2%", value: 13 },
    { name: "大洋洲 6.3%", value: 10 },
  ], ["#0fb8ff", "#48df75", "#28d7de", "#4c83d9", "#d59336", "#d7b844"]);
}

function horizontalDistributionOption(): EChartsOption {
  return {
    color: ["#208cff"],
    grid: { left: 58, right: 56, top: 20, bottom: 18 },
    tooltip: { trigger: "axis" },
    xAxis: { type: "value", max: 50, ...axisStyle, axisLabel: { color: "#8fb5d8", formatter: "{value}%" } },
    yAxis: { type: "category", data: ["0~20", "20~30", "30~40", "40~60"], ...axisStyle },
    series: [
      {
        type: "bar",
        data: [9.8, 32.1, 42.6, 15.5],
        barWidth: 12,
        itemStyle: { borderRadius: [0, 8, 8, 0], color: "#208cff" },
        label: { show: true, position: "right", color: "#b9d7ef", formatter: "{c}%" },
      },
    ],
  };
}

function groupedBarOption(): EChartsOption {
  const labels = ["G07", "G12", "G15", "G18", "G21", "G24", "C03", "C07", "C11", "C14", "R03", "R07", "E11", "E19", "J03", "J07", "S02", "S06", "S11"];
  const base = [28, 31, 44, 48, 50, 47, 30, 39, 45, 49, 41, 34, 46, 51, 38, 42, 37, 45, 41];
  return {
    color: ["#208cff", "#45d469", "#8b63ff"],
    legend: { top: 6, textStyle: { color: "#b9d7ef" }, data: ["L1 (GPS)", "L2 (GPS)", "L5 (GPS)"] },
    grid: { left: 50, right: 18, top: 46, bottom: 34 },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: labels, ...axisStyle },
    yAxis: { type: "value", min: 0, max: 60, ...axisStyle },
    series: [
      { name: "L1 (GPS)", type: "bar", data: base, barWidth: 9, itemStyle: { borderRadius: [4, 4, 0, 0] } },
      { name: "L2 (GPS)", type: "bar", data: base.map((v, i) => Number((v - 3.2 + Math.sin(i) * 1.8).toFixed(1))), barWidth: 9, itemStyle: { borderRadius: [4, 4, 0, 0] } },
      { name: "L5 (GPS)", type: "bar", data: base.map((v, i) => Number((v - 5.1 + Math.cos(i) * 1.6).toFixed(1))), barWidth: 9, itemStyle: { borderRadius: [4, 4, 0, 0] } },
    ],
  };
}

function snrTrendOption(): EChartsOption {
  const x = Array.from({ length: 16 }, (_, i) => `14:${String(2 + i * 2).padStart(2, "0")}`);
  return {
    color: ["#208cff", "#45d469", "#8b63ff"],
    legend: { top: 4, textStyle: { color: "#b9d7ef" }, data: ["L1 平均", "L2 平均", "L5 平均"] },
    grid: { left: 46, right: 14, top: 38, bottom: 28 },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: x, ...axisStyle },
    yAxis: { type: "value", min: 0, max: 60, ...axisStyle },
    series: [
      { name: "L1 平均", type: "line", smooth: true, symbol: "circle", symbolSize: 4, data: [45, 47, 46, 48, 47, 46, 47, 48, 46, 47, 46, 48, 47, 46, 47, 46] },
      { name: "L2 平均", type: "line", smooth: true, symbol: "circle", symbolSize: 4, data: [38, 39, 39, 40, 39, 39, 40, 41, 40, 40, 41, 40, 40, 39, 39, 40] },
      { name: "L5 平均", type: "line", smooth: true, symbol: "circle", symbolSize: 4, data: [41, 42, 42, 43, 42, 42, 43, 44, 43, 43, 44, 43, 42, 42, 42, 41] },
    ],
  };
}

function snrPreviewOption(): EChartsOption {
  return {
    grid: { left: 32, right: 12, top: 12, bottom: 24 },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: ["05-19", "05-20", "05-21", "05-22", "05-23", "05-24", "05-25", "05-26"], ...axisStyle },
    yAxis: { type: "value", min: 0, max: 60, ...axisStyle },
    series: [
      {
        type: "line",
        data: [38, 42, 34, 36, 41, 39, 44, 40],
        smooth: true,
        symbol: "none",
        lineStyle: { color: "#35d95e", width: 2 },
        areaStyle: { color: "rgba(53, 217, 94, 0.18)" },
      },
    ],
  };
}

export function HomePage() {
  return (
    <Shell active="home" page={1}>
      <div className="home-layout">
        <div className="home-left">
          <div className="top-metrics">
            <MetricCard icon="⌖" label="当前在线GNSS站点总数" value="128 / 156" sub="在线率 82.1%" bars />
            <MetricCard icon="✦" label="当前活跃卫星总数" value="48 / 53" sub="可用率 90.6%" bars />
            <MetricCard icon="◷" label="最新统计时间" value="2025-05-26 14:30:00" sub="数据每5分钟自动更新" />
          </div>
          <Panel title="各监测站点当前 VOD 值（Vegetation Optical Depth）" extra={<div className="panel-actions"><SelectPill label="无量纲" /><SelectPill label="自定义" /></div>}>
            <div className="gauge-grid">
              {stationCards.map((station, index) => (
                <GaugeCard key={station.code} station={station} index={index} />
              ))}
            </div>
            <div className="legend-row">
              <span><StatusDot />1VOD &lt; 0.2（偏低）</span>
              <span><StatusDot />0.2 ≤ VOD &lt; 0.6（正常）</span>
              <span><StatusDot tone="orange" />0.6 ≤ VOD &lt; 1.0（良好）</span>
              <span><StatusDot tone="red" />VOD ≥ 1.0（高）</span>
            </div>
          </Panel>
          <Panel title="VOD 变化趋势（最近24小时）" extra={<span className="more">更多 ›</span>}>
            <div className="trend-mini-grid">
              {stationCards.map((station, index) => (
                <div className="mini-chart-card" key={station.code}>
                  <div><b>{station.code}</b><span>{station.name}</span><em>{station.value.toFixed(3)}</em></div>
                  <Sparkline data={miniTrends[index]} color={station.color} />
                </div>
              ))}
            </div>
          </Panel>
          <div className="home-bottom">
            <Panel title="观测数据概览（当前时段）">
              <div className="summary-list">
                <p><span>⌘ 观测总数</span><b>1,245,632</b></p>
                <p><span>⊙ 有效观测数</span><b>1,102,875</b></p>
                <p><span>≋ 平均 SNR</span><b>32.7 dBHz</b></p>
                <p><span>✦ 平均卫星数</span><b>18.6 颗</b></p>
              </div>
            </Panel>
            <Panel title="卫星系统分布">
              <DataChart option={donutOption([
                { name: "GPS 42.1%", value: 42.1 },
                { name: "北斗 BDS 34.7%", value: 34.7 },
                { name: "GLONASS 15.3%", value: 15.3 },
                { name: "Galileo 5.6%", value: 5.6 },
                { name: "其他 2.3%", value: 2.3 },
              ], ["#148dff", "#36ce65", "#d2a63a", "#31d7e8", "#8d43dd"])} />
            </Panel>
            <Panel title="站点分布地图" extra={<span className="more">更多 ›</span>}>
              <ChinaMapMini />
            </Panel>
          </div>
        </div>
        <aside className="home-right">
          <Panel title="环境与系统状态" extra={<span className="more">更多 ›</span>}>
            <div className="environment-grid">
              <div><i>♨</i><span>温度</span><b>23.6 °C</b></div>
              <div><i>♢</i><span>湿度</span><b>41 %</b></div>
              <div><i>◴</i><span>气压</span><b>1012 hPa</b></div>
            </div>
            <div className="run-state">
              <span>系统运行状态</span><b><StatusDot />正常运行</b>
              <span>数据延迟</span><b>&lt; 10 秒</b>
            </div>
          </Panel>
          <Panel title="告警与异常事件" extra={<span className="more">更多 ›</span>}>
            <div className="alerts-column">
              {alerts.map((alert, index) => (
                <div className={`alert-card alert-${index}`} key={alert.title}>
                  <strong>△ {alert.title}</strong>
                  <span>{alert.level}</span>
                  <p>站点：{alert.station}</p>
                  <p>时间：{alert.time}</p>
                  <small>{alert.note}</small>
                  {index < 2 ? <MiniSpark tone={index === 0 ? "red" : "orange"} /> : null}
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="未来天气预报（主要区域）" extra={<span className="more">更多 ›</span>}>
            <div className="weather-grid">
              {weatherCards.map((item) => (
                <div className="weather-card" key={item.city}>
                  <b>{item.city}</b>
                  <i>{item.icon}</i>
                  <span>{item.text}</span>
                  <small>{item.temp}<br />{item.wind}</small>
                </div>
              ))}
            </div>
          </Panel>
        </aside>
      </div>
    </Shell>
  );
}

function MiniSpark({ tone = "blue" }: { tone?: "red" | "orange" | "blue" }) {
  const color = tone === "red" ? "#ff4141" : tone === "orange" ? "#ff9c22" : "#1ec8ff";
  return (
    <svg className="mini-spark" viewBox="0 0 120 44" preserveAspectRatio="none">
      <polyline points="0,8 12,13 20,28 31,21 42,31 54,26 65,34 76,22 86,29 98,36 110,32 120,39" fill="none" stroke={color} strokeWidth="3" />
    </svg>
  );
}

function ChinaMapMini() {
  const dots = [
    [31, 36], [39, 43], [47, 35], [55, 46], [63, 39], [70, 48],
    [36, 57], [46, 62], [58, 58], [68, 64], [52, 72], [75, 34],
  ];

  return (
    <div className="china-map-mini">
      {dots.map(([left, top], index) => (
        <span key={`${left}-${top}`} className={index % 5 === 0 ? "warn-dot" : ""} style={{ left: `${left}%`, top: `${top}%` }} />
      ))}
      <div className="mini-inset" />
    </div>
  );
}

export function StationsPage() {
  return (
    <Shell active="stations" page={2}>
      <div className="stations-page">
        <div className="filter-strip">
          <div className="search-box">搜索站点名称 / 站点ID / 位置 <b>⌕</b></div>
          <SelectPill label="全部地区" />
          <SelectPill label="全部状态" />
          <SelectPill label="全部系统" />
          <button className="ghost-button">▽ 更多筛选</button>
          <div className="station-total">
            <span><StatusDot />在线 142</span>
            <span><StatusDot tone="red" />离线 14</span>
            <span><StatusDot tone="gray" />维护 3</span>
            <b>总数 159</b>
          </div>
        </div>
        <aside className="station-left">
          <Panel title="地区分布统计">
            <div className="donut-with-center">
              <DataChart option={stationDonutOption()} />
              <strong>159<small>总站点</small></strong>
            </div>
          </Panel>
          <Panel title="实时站点列表" extra={<span className="more">更多 ›</span>}>
            <table className="compact-table">
              <tbody>
                {worldStations.map((item) => (
                  <tr key={item.code}>
                    <td>{item.code}</td>
                    <td>{item.name}</td>
                    <td className={item.status === "offline" ? "danger" : "cyan"}>{item.value}</td>
                    <td><StatusDot tone={item.status === "offline" ? "red" : "green"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="legend-row tight"><span><StatusDot />在线 142</span><span><StatusDot tone="red" />离线 14</span><span><StatusDot tone="gray" />维护 3</span></div>
          </Panel>
        </aside>
        <WorldMap />
        <aside className="station-right">
          <Panel title="图例说明">
            <div className="map-legend">
              <p>站点状态</p>
              <span><StatusDot />在线</span>
              <span><StatusDot tone="red" />离线</span>
              <span><StatusDot tone="gray" />维护</span>
              <p>VOD 强度 (m)</p>
              <span><i className="ring-dot large" />&gt; 0.80</span>
              <span><i className="ring-dot" />0.50 ~ 0.80</span>
              <span><i className="ring-dot small" />0.20 ~ 0.50</span>
            </div>
          </Panel>
          <div className="map-controls">
            <div className="compass-control"><button>‹</button><button>◎</button><button>›</button><button>⌄</button></div>
            <button>＋</button><button>－</button>
            <button className="wide">重置视角</button>
          </div>
        </aside>
      </div>
    </Shell>
  );
}

function WorldMap() {
  const denseDots = Array.from({ length: 72 }, (_, index) => ({
    left: 13 + ((index * 37) % 76),
    top: 20 + ((index * 53) % 58),
    offline: index % 13 === 0,
  }));

  return (
    <div className="world-map">
      <svg className="world-lines" viewBox="0 0 1000 560" preserveAspectRatio="none">
        <path d="M225 235 Q425 120 760 240" />
        <path d="M225 235 Q515 160 820 210" />
        <path d="M340 405 Q515 180 760 240" />
        <path d="M520 320 Q640 210 805 390" />
        <path d="M760 240 Q660 150 500 205" />
        <path d="M310 310 Q520 240 805 390" />
        <path d="M500 205 Q380 130 225 235" />
        <path d="M340 405 Q445 330 520 320" />
        <path d="M760 240 Q820 305 805 390" />
        <path d="M225 235 Q350 260 520 320" />
      </svg>
      <div className="world-glow" />
      <div className="continent c1" />
      <div className="continent c2" />
      <div className="continent c3" />
      <div className="continent c4" />
      <div className="continent c5" />
      {denseDots.map((dot, index) => (
        <i
          className={`map-dot ${dot.offline ? "offline" : ""}`}
          key={`${dot.left}-${dot.top}-${index}`}
          style={{ left: `${dot.left}%`, top: `${dot.top}%` }}
        />
      ))}
      {worldStations.map((item, index) => (
        <div className={`map-station ${item.status}`} key={item.code} style={{ left: `${item.x}%`, top: `${item.y}%`, width: item.size, height: item.size }}>
          <span />
          {[0, 2, 4].includes(index) ? (
            <div className="station-pop">
              <b>{item.code}</b> {item.name}<br />
              VOD <strong>{item.value}</strong> m<br />
              状态：<em>{item.status === "online" ? "在线" : "离线"}</em>
            </div>
          ) : null}
        </div>
      ))}
      <div className="map-tip">
        <b>操作提示</b>
        <span>拖拽旋转视角</span>
        <span>滚轮缩放地图</span>
        <span>点击站点查看详情</span>
      </div>
    </div>
  );
}

function trendOption(): EChartsOption {
  const x = Array.from({ length: 72 }, (_, i) => `05-${19 + Math.floor(i / 12)} ${String((i * 2) % 24).padStart(2, "0")}:00`);
  const make = (base: number, amp: number) => x.map((_, i) => Number((base + Math.sin(i / 3) * amp + Math.cos(i / 7) * 0.035 + Math.sin(i * 1.7) * 0.018 - ([18, 19, 20, 41, 42, 43, 57, 58, 68].includes(i) ? 0.25 : 0)).toFixed(3)));
  return {
    color: ["#45d65f", "#2aa4ff", "#9163f8"],
    tooltip: { trigger: "axis" },
    legend: { top: 12, textStyle: { color: "#b9d7ef" }, data: ["L1 · G01", "L1 · G02", "L2 · G01", "L2 · G02", "L5 · G01", "L5 · G02"] },
    grid: { left: 55, right: 28, top: 72, bottom: 80 },
    dataZoom: [{ type: "slider", height: 34, bottom: 24, borderColor: "#1f6fa8", fillerColor: "rgba(20,128,255,.28)" }],
    xAxis: { type: "category", data: x, ...axisStyle },
    yAxis: { type: "value", name: "VOD", min: 0, max: 1.2, ...axisStyle },
    series: [
      { name: "L1 · G01", type: "line", data: make(0.9, 0.05), symbol: "none", smooth: true },
      { name: "L1 · G02", type: "line", data: make(0.82, 0.06), symbol: "none", smooth: true, lineStyle: { type: "dashed" } },
      { name: "L2 · G01", type: "line", data: make(0.72, 0.05), symbol: "none", smooth: true },
      { name: "L2 · G02", type: "line", data: make(0.66, 0.04), symbol: "none", smooth: true, lineStyle: { type: "dashed" } },
      { name: "L5 · G01", type: "line", data: make(0.55, 0.04), symbol: "none", smooth: true },
      {
        name: "L5 · G02",
        type: "line",
        data: make(0.5, 0.04),
        symbol: "none",
        smooth: true,
        lineStyle: { type: "dashed" },
        markArea: {
          itemStyle: { color: "rgba(255, 65, 65, 0.22)", borderColor: "#ff4b3e", borderWidth: 1, borderType: "dashed" },
          data: [[{ xAxis: x[14], name: "异常 #1" }, { xAxis: x[20] }], [{ xAxis: x[39], name: "异常 #2" }, { xAxis: x[46] }], [{ xAxis: x[56], name: "异常 #3" }, { xAxis: x[62] }], [{ xAxis: x[67], name: "异常 #4" }, { xAxis: x[71] }]],
        },
        markPoint: {
          symbol: "pin",
          symbolSize: 42,
          itemStyle: { color: "#ff4b4b" },
          label: { color: "#fff", formatter: "!" },
          data: [{ name: "异常点1", coord: [x[39], 0.46] }, { name: "异常点2", coord: [x[41], 0.36] }, { name: "异常点3", coord: [x[68], 0.31] }],
        },
      },
    ],
  };
}

export function TrendPage() {
  return (
    <Shell active="trend" page={3}>
      <div className="analysis-layout">
        <Panel className="filter-panel" title="VOD 时间序列监测  ⓘ">
          <div className="inline-filters">
            <span>站点选择</span><SelectPill label="BJFS 北京房山" wide />
            <span>卫星选择</span><SelectPill label="全部卫星 (8)" wide />
            <span>时间范围</span><button>2025-05-19 00:00</button><em>~</em><button>2025-05-26 14:32</button>
            {["1天", "3天", "7天", "14天", "30天", "自定义"].map((item) => <button className={item === "7天" ? "active" : ""} key={item}>{item}</button>)}
            {["L1", "L2", "L5", "全部"].map((item) => <button className={`band ${item.toLowerCase()}`} key={item}>{item}</button>)}
            <button className="icon-button">刷新</button><button className="icon-button">导出</button>
          </div>
        </Panel>
        <Panel className="trend-main" title="VOD（植被光学厚度）时间序列">
          <DataChart option={trendOption()} />
        </Panel>
        <aside className="trend-side">
          <Panel title="当前选择信息">
            <div className="site-card">
              <strong>BJFS 北京房山</strong>
              <p>纬度: 39.7467° N / 经度: 116.1390° E</p>
              <p>海拔: 93.0 m / 气候区: 温带季风</p>
            </div>
          </Panel>
          <Panel title="实时指标（最新:14:30）">
            <table className="compact-table metric-table">
              <tbody>{[["L1", "0.641", "-0.028", "-0.052"], ["L2", "0.443", "+0.012", "-0.031"], ["L5", "0.318", "-0.009", "-0.017"]].map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={cell} className={index > 1 && cell.startsWith("+") ? "danger" : index > 1 ? "good" : ""}>{cell}</td>)}</tr>)}</tbody>
            </table>
          </Panel>
          <Panel title="异常统计（所选时间范围）">
            <div className="stat-row"><b>异常时段<br /><em>4</em></b><b>异常总时长<br /><em>14小时15分</em></b><b>影响数据点<br /><em>1,268</em></b><b>严重异常<br /><em className="danger">2</em></b></div>
          </Panel>
          <Panel title="数据概览">
            <div className="summary-list compact">
              <p><span>数据总量</span><b>72,960</b></p>
              <p><span>有效数据</span><b>70,845</b></p>
              <p><span>缺失数据</span><b>2,115</b></p>
              <p><span>采样间隔</span><b>15 分钟</b></p>
            </div>
          </Panel>
        </aside>
        <div className="trend-bottom">
          <Panel title="当前卫星状态（所选站点）"><DataChart option={donutOption([{ name: "正常", value: 7 }, { name: "信号弱", value: 1 }, { name: "异常", value: 0 }], ["#42d86b", "#ffae19", "#ff4848"])} /></Panel>
          <Panel title="频段统计（所选时间范围）">
            <table className="wide-stats"><tbody>{[["L1 (1.575 GHz)", "0.623", "0.412", "0.911", "98.1%"], ["L2 (1.227 GHz)", "0.448", "0.256", "0.734", "97.6%"], ["L5 (1.176 GHz)", "0.322", "0.165", "0.528", "96.9%"]].map((r) => <tr key={r[0]}>{r.map((c) => <td key={c}>{c}</td>)}</tr>)}</tbody></table>
          </Panel>
          <Panel title="异常事件列表（所选时间范围）">
            <table className="wide-stats"><tbody>{["05-20 08:15 - 05-20 12:45", "05-22 18:30 - 05-23 06:30", "05-24 09:45 - 05-24 16:30"].map((time, i) => <tr key={time}><td>#{i + 1}</td><td>{time}</td><td><b className={i === 1 ? "danger" : "warn"}>{i === 1 ? "高" : "中"}</b></td><td>L1,L2,L5</td></tr>)}</tbody></table>
          </Panel>
        </div>
      </div>
    </Shell>
  );
}

function snrScatterOption(): EChartsOption {
  const make = (offset: number) =>
    Array.from({ length: 190 }, (_, i) => {
      const x = ((i * 37) % 900) / 10 + ((i % 5) - 2) * 0.55;
      const y = 19 + Math.log(x + 5) * 6.8 + Math.sin(i * 1.9) * 4.4 + Math.cos(i / 6) * 2.1 + offset;
      return [Number(Math.max(0, Math.min(90, x)).toFixed(1)), Number(Math.max(12, Math.min(55, y)).toFixed(1))];
    });
  return {
    color: ["#268dff", "#45d25f", "#8b63ff"],
    legend: { top: 8, textStyle: { color: "#bed9ef" }, data: ["L1 (GPS)", "L2 (GPS)", "L5 (GPS)"] },
    grid: { left: 58, right: 28, top: 54, bottom: 48 },
    tooltip: {},
    xAxis: { type: "value", min: 0, max: 90, name: "Elevation (°) 高度角", ...axisStyle },
    yAxis: { type: "value", min: 0, max: 60, name: "SNR (dB-Hz)", ...axisStyle },
    series: [
      { name: "L1 (GPS)", type: "scatter", data: make(3), symbolSize: 7 },
      { name: "L2 (GPS)", type: "scatter", data: make(0), symbolSize: 7 },
      { name: "L5 (GPS)", type: "scatter", data: make(-3), symbolSize: 7 },
    ],
  };
}

export function SnrPage() {
  return (
    <Shell active="snr" title="GNSS-VOD SNR实时监测" page={4}>
      <div className="snr-page">
        <div className="station-tabs">
          <b>站点选择</b><SelectPill label="BJFS 北京房山" wide /><button>‹</button><button>›</button><span>收藏站点</span>
          {stationCards.map((s) => <button className={s.code === "BJFS" ? "active" : ""} key={s.code}>{s.code} {s.name}</button>)}
          <div className="update-box">◷ 数据更新时间 <b>2025-05-26 14:32:40</b><small>更新间隔：1 秒</small></div>
        </div>
        <div className="snr-kpis">
          <MetricCard icon="✦" label="可见卫星数" value="48 / 53" sub="可用率 90.6%" />
          <MetricCard icon="≋" label="当前平均SNR" value="41.2 dB-Hz" sub="" />
          <MetricCard icon="●" label="L1 平均SNR" value="42.8 dB-Hz" sub="" />
          <MetricCard icon="●" label="L2 平均SNR" value="39.6 dB-Hz" sub="" accent="#49db68" />
          <MetricCard icon="●" label="L5 平均SNR" value="40.4 dB-Hz" sub="" accent="#9265ff" />
          <MetricCard icon="◇" label="信号质量指数（SQI）" value="优" sub="92 / 100" />
        </div>
        <aside className="snr-left">
          <Panel title="信号质量概览"><QualityRing /></Panel>
          <Panel title="频点分布（可见卫星数）"><FrequencyRing /></Panel>
          <Panel title="SNR 统计（dB-Hz）">
            <table className="compact-table"><tbody>{[["L1", "42.8", "43.4", "18.7", "52.8", "6.2"], ["L2", "39.6", "40.1", "16.3", "50.2", "6.7"], ["L5", "40.4", "41.0", "17.9", "51.3", "6.1"], ["全部", "41.2", "41.8", "16.3", "52.8", "6.4"]].map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table>
          </Panel>
        </aside>
        <Panel className="snr-scatter" title="SNR 散点图（按高度角）"><DataChart option={snrScatterOption()} /></Panel>
        <Panel className="snr-table" title="当前可见卫星及SNR（dB-Hz）">
          <table className="compact-table snr-data"><tbody>{snrRows.map((row) => <tr key={row[1]}>{row.map((cell, i) => <td key={cell} className={i === 6 && cell === "优" ? "good" : ""}>{cell}</td>)}</tr>)}</tbody></table>
        </Panel>
        <Panel className="snr-bars" title="可见卫星SNR（按卫星ID/PRN）">
          <DataChart option={groupedBarOption()} />
        </Panel>
        <Panel className="snr-line" title="SNR 平均值趋势（最近30分钟）"><DataChart option={snrTrendOption()} /></Panel>
      </div>
    </Shell>
  );
}

function QualityRing({ value = "92", label = "/100", compact = false }: { value?: string; label?: string; compact?: boolean }) {
  return (
    <div className={`quality-ring ${compact ? "compact-ring" : ""}`}>
      <div className="ring-score"><b>{value}</b><span>{label}</span></div>
      <ul>
        <li><StatusDot />优 (80-100) <b>82.6%</b></li>
        <li><StatusDot tone="orange" />良 (60-80) <b>13.7%</b></li>
        <li><StatusDot tone="red" />差 (20-40) <b>0.5%</b></li>
      </ul>
    </div>
  );
}

function FrequencyRing() {
  return (
    <div className="frequency-ring">
      <div className="freq-score"><b>48</b><span>总数</span></div>
      <ul>
        <li><i className="freq-dot l1" />L1 <b>48</b><em>100.0%</em></li>
        <li><i className="freq-dot l2" />L2 <b>46</b><em>95.8%</em></li>
        <li><i className="freq-dot l5" />L5 <b>33</b><em>68.8%</em></li>
      </ul>
    </div>
  );
}

export function SkyPage() {
  return (
    <Shell active="sky" page={5}>
      <div className="sky-page">
        <div className="sky-top-left"><b>监测站点</b><SelectPill label="BJFS 北京房山站（默认站）" wide /><span><StatusDot />正常运行</span></div>
        <div className="sky-title">卫星星空图（Sky Plot）</div>
        <div className="sky-top-right"><span>时间窗口</span><SelectPill label="最近30分钟" /><span>更新间隔</span><SelectPill label="1秒" /><button className="ghost-button">导出星空图</button></div>
        <aside className="sky-left">
          <Panel title="星座可见性统计" extra={<span className="more">更多 ›</span>}>
            <div className="constellation-grid">{[["GPS", "11 / 12", "10"], ["GLONASS", "8 / 10", "7"], ["Galileo", "7 / 8", "6"], ["北斗 (BDS)", "10 / 14", "9"]].map((r) => <div key={r[0]}><b>{r[0]}</b><span>可见 <em>{r[1]}</em></span><span>跟踪 <em>{r[2]}</em></span></div>)}</div>
            <div className="tracking-total">总计 <b>可见 36 / 44</b><span>72.7% 跟踪率</span></div>
          </Panel>
          <Panel title="观测质量（全部星座）" extra={<span className="more">更多 ›</span>}>
            <div className="quality-lines"><p>平均 C/N₀ <b>45.3 dB-Hz</b><MiniSpark /></p><p>最小 C/N₀ <b>23.8 dB-Hz</b><MiniSpark /></p><p>信号强度中位数 <b>42.1 dB-Hz</b><MiniSpark /></p></div>
          </Panel>
          <Panel title="仰角遮罩设置"><div className="elevation-mask"><b>15°</b><span>当前遮罩角度</span><i /></div></Panel>
        </aside>
        <SkyPlot />
        <aside className="sky-right">
          <Panel title="选中卫星详情">
            <div className="sat-detail">
              <div className="sat-radar" />
              <div><b>G07 (GPS)</b><p>卫星系统 GPS</p><p>PRN G07</p><p>仰角 / 方位角 72.4° / 23.6°</p><p>信号状态 <span className="good">跟踪良好</span></p><p>C/N₀ 48.6 dB-Hz</p></div>
              <div className="signal-bars">{["L1C", "L2W", "L5Q", "L1W", "L2C"].map((item, i) => <p key={item}><span>{item}</span><i style={{ width: `${75 + i * 4}%` }} /><b>{(47.2 - i * 0.8).toFixed(1)}</b></p>)}</div>
            </div>
          </Panel>
          <Panel title="卫星轨迹时间轴（最近30分钟）" extra={<span className="more">更多 ›</span>}>
            <div className="track-timeline">{["G07 (GPS)", "R08 (GLO)", "E19 (GAL)", "C07 (BDS)"].map((item) => <p key={item}><span>{item}</span><i /></p>)}</div>
          </Panel>
          <Panel title="观测状态">
            <div className="obs-status"><div className="sat-radar small" />{[["数据链路", "正常"], ["数据延迟", "0.42 s"], ["接收机状态", "正常"], ["天线状态", "正常"], ["观测卫星数", "32"], ["可见卫星数", "36"], ["定位模式", "单点定位"], ["PDOP", "1.43"]].map((r) => <p key={r[0]}><span>{r[0]}</span><b>{r[1]}</b></p>)}</div>
          </Panel>
          <div className="page-buttons"><button>‹ 上一页</button><button>下一页 ›</button></div>
        </aside>
      </div>
    </Shell>
  );
}

function SkyPlot() {
  return (
    <div className="sky-plot">
      <svg className="orbit-lines" viewBox="0 0 720 720">
        <path d="M115 255 C220 110 480 92 600 245" stroke="#1b9cff" />
        <path d="M110 445 C245 630 520 610 610 402" stroke="#8d63ff" />
        <path d="M185 180 C355 130 520 240 570 420" stroke="#39d75b" />
        <path d="M120 520 C260 315 470 160 620 250" stroke="#ffb11d" />
      </svg>
      <div className="direction north">0°<br />北</div>
      <div className="direction east">90°<br />东</div>
      <div className="direction south">180°<br />南</div>
      <div className="direction west">270°<br />西</div>
      {skySatellites.map((sat) => (
        <div className="sat-point" key={sat.id} style={{ left: `${sat.x}%`, top: `${sat.y}%`, color: sat.color }}>
          <span /> <b>{sat.id}</b>
        </div>
      ))}
      <div className="sky-legend">{["GPS", "GLONASS", "Galileo", "北斗 (BDS)"].map((item, i) => <span key={item}><i className={`legend-color c${i}`} />{item}</span>)}</div>
    </div>
  );
}

export function HistoryPage() {
  return (
    <Shell active="history" page={6}>
      <div className="history-page">
        <aside className="history-filter">
          <Panel title="历史数据查询">
            <div className="form-stack">
              <b>时间范围</b>
              <div className="quick-buttons">{["今天", "昨天", "近7天", "近30天", "自定义"].map((i) => <button className={i === "近7天" ? "active" : ""} key={i}>{i}</button>)}</div>
          <label className="field-line"><span>开始时间</span><button>2025-05-19 00:00:00 <b>▣</b></button></label>
          <label className="field-line"><span>结束时间</span><button>2025-05-26 14:32:45 <b>▣</b></button></label>
          <label className="field-line"><span>站点选择</span><button>全部站点 <b>⌄</b></button></label>
          <label className="field-line"><span>卫星/PRN</span><button>请输入卫星编号或PRN <b>⌄</b></button></label>
          <label className="field-line"><span>频段选择</span><button>全部频段 <b>⌄</b></button></label>
          <label className="field-line"><span>状态</span><button>全部状态 <b>⌄</b></button></label>
              <b>VOD范围</b><div className="range-row"><button>最小值</button><span>~</span><button>最大值</button></div>
              <b>SNR范围 (dB-Hz)</b><div className="range-row"><button>最小值</button><span>~</span><button>最大值</button></div>
              <div className="query-actions"><button className="primary">⌕ 查询</button><button>⟳ 重置</button></div>
            </div>
          </Panel>
        </aside>
        <section className="history-main">
          <div className="history-kpis">
            <MetricCard icon="◉" label="总记录数" value="1,245,632" sub="条记录" />
            <MetricCard icon="⌖" label="涉及站点数" value="48" sub="个站点" />
            <MetricCard icon="△" label="异常记录数" value="18,632" sub="占比 1.50%" accent="#ff6a3a" />
            <MetricCard icon="≋" label="平均 VOD 值" value="0.487" sub="VOD" />
            <MetricCard icon="◌" label="平均 SNR 值" value="32.7" sub="dB-Hz" />
          </div>
          <Panel className="history-preview" title="数据趋势预览（基于当前查询条件）">
            <div className="preview-grid">
              <div><h4>VOD 值时间趋势</h4><DataChart option={lineOption([0.82, 0.78, 0.86, 0.94, 0.88, 0.79, 0.76, 0.84, 0.9, 0.83, 0.81, 0.87], "#22c8ff")} /></div>
              <div><h4>SNR 值时间趋势 (dB-Hz)</h4><DataChart option={snrPreviewOption()} /></div>
              <div><h4>VOD 值分布</h4><DataChart option={donutOption([{ name: "0~0.2", value: 8.3 }, { name: "0.2~0.5", value: 49.7 }, { name: "0.5~0.8", value: 32.4 }, { name: "0.8~1.2", value: 9.6 }], ["#1f8dff", "#35cf68", "#47d3e8", "#ff4848"])} /></div>
              <div><h4>SNR 值分布 (dB-Hz)</h4><DataChart option={horizontalDistributionOption()} /></div>
            </div>
          </Panel>
          <Panel className="result-table" title="查询结果（共 1,245,632 条记录）" extra={<div className="table-actions"><button>⟳ 刷新</button><button>⇩ 导出 CSV</button><button className="green-btn">▣ 导出 Excel</button></div>}>
            <table className="history-table">
              <thead><tr>{["时间", "站点", "卫星（PRN）", "频段", "VOD 值", "SNR 值（dB-Hz）", "状态", "更新时间"].map((h) => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>{historyRows.map((row) => <tr key={`${row[0]}-${row[1]}-${row[2]}`}>{row.map((cell, index) => <td key={`${cell}-${index}`} className={index === 4 ? "cyan" : index === 5 ? "good" : cell === "异常" ? "danger" : ""}>{index === 6 ? <><StatusDot tone={cell === "异常" ? "red" : "green"} />{cell}</> : cell}</td>)}</tr>)}</tbody>
            </table>
            <div className="pagination"><span>每页显示：100 条</span><b>共 1,245,632 条</b>{["|<", "<", "1", "2", "3", "4", "5", "6", "...", "12,457", ">", ">|"].map((p) => <button className={p === "6" ? "active" : ""} key={p}>{p}</button>)}<span>前往 6 页</span></div>
          </Panel>
        </section>
      </div>
    </Shell>
  );
}

export default HomePage;
