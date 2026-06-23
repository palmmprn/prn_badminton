import React, { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import {
  TrendingUp,
  Activity,
  Zap,
  Target,
  Flame,
  Award,
  RefreshCw,
  Clock,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { UserProfile } from "../types";

interface PerformanceAnalyticsProps {
  user: UserProfile;
}

// Simulated historic performance logs
const WEEKLY_ACTIVITY_DATA = [
  { week: "สัปดาห์ 1", minutes: 90, calories: 520, drillsPassed: 1 },
  { week: "สัปดาห์ 2", minutes: 120, calories: 750, drillsPassed: 2 },
  { week: "สัปดาห์ 3", minutes: 180, calories: 1100, drillsPassed: 4 },
  { week: "สัปดาห์ 4", minutes: 240, calories: 1540, drillsPassed: 5 },
];

const SMASH_SPEEDS_DATA = [
  { session: "01/06", forehandSmash: 285, backhandSmash: 195 },
  { session: "05/06", forehandSmash: 310, backhandSmash: 215 },
  { session: "10/06", forehandSmash: 325, backhandSmash: 220 },
  { session: "12/06", forehandSmash: 352, backhandSmash: 242 },
];

const BADMINTON_RADAR_SKILLS = [
  { attribute: "เสิร์ฟแม่นยำ (Serve Accuracy)", value: 78, fullMark: 100 },
  { attribute: "ความอึดสปีดคอร์ท (Stamina)", value: 85, fullMark: 100 },
  { attribute: "หยอดปั่นสปิน (Net Play)", value: 72, fullMark: 100 },
  { attribute: "พลังตบขยี้ (Smash Power)", value: 91, fullMark: 100 },
  { attribute: "ฟุตเวิร์คคล่องตัว (Footwork Fluidity)", value: 82, fullMark: 100 },
];

export default function PerformanceAnalytics({ user }: PerformanceAnalyticsProps) {
  const [activeSensorMetric, setActiveSensorMetric] = useState<"sweetspot" | "tilt">("sweetspot");
  const [sensorStatus, setSensorStatus] = useState<"connected" | "calibrating" | "standby">("connected");
  const [sweetSpotVal, setSweetSpotVal] = useState(74);

  const simulateSensorCalibrate = () => {
    setSensorStatus("calibrating");
    setTimeout(() => {
      setSensorStatus("connected");
      setSweetSpotVal(Math.floor(Math.random() * 15) + 80); // higher sweet spot after calibration!
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* LEFT COLUMN: Summary Widgets and Racket IoT Diagnostics */}
      <div className="xl:col-span-4 flex flex-col gap-6">
        {/* Core Stats Overview Cards */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm transition-all">
          <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-800 pb-3.5 mb-4">
            <h3 className="text-sm font-display font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              ภาพรวมสถิติประสิทธิภาพการซ้อม
            </h3>
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded uppercase font-mono">
              Live Link
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {/* Average Smash */}
            <div className="bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-150 dark:border-slate-850/60 transition-all">
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                ความเร็วตบสูงสุด
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-display font-bold text-indigo-950 dark:text-lime-400">
                  352
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">km/h</span>
              </div>
              <span className="text-[9px] text-emerald-500 font-bold block mt-1">
                ▲ เพิ่มขึ้น 14% วีคนี้
              </span>
            </div>

            {/* Drills Accuracy */}
            <div className="bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-150 dark:border-slate-850/60 transition-all">
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                <Target className="w-3.5 h-3.5 text-indigo-500" />
                ความแม่นยำรวม
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-display font-bold text-indigo-950 dark:text-lime-400">
                  81%
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">Accuracy</span>
              </div>
              <span className="text-[9px] text-indigo-550 dark:text-indigo-400 font-bold block mt-1">
                🎯 สอบผ่านควิซแล้ว
              </span>
            </div>

            {/* Total Playing Hours */}
            <div className="bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-150 dark:border-slate-850/60 transition-all">
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                <Clock className="w-3.5 h-3.5 text-lime-600" />
                ชั่วโมงคอร์ทเดือนนี้
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-display font-bold text-indigo-950 dark:text-lime-400">
                  14.5
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">ชั่วโมง</span>
              </div>
              <span className="text-[9px] text-slate-400 font-medium block mt-1">
                เป้าหมาย: 20 ชั่วโมง
              </span>
            </div>

            {/* Estimated Active Calories */}
            <div className="bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-150 dark:border-slate-850/60 transition-all">
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                แคลอรีที่เผาพลาญ
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-display font-bold text-indigo-950 dark:text-lime-400">
                  3,910
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">kcal</span>
              </div>
              <span className="text-[9px] text-emerald-500 font-bold block mt-1">
                🔥 ล้นเป้ากระโดดตบ
              </span>
            </div>
          </div>
        </div>

        {/* Smart Racket IoT Sensor Interface */}
        <div className="bg-slate-950 text-white rounded-2xl border border-slate-850 p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-lime-400/5 rounded-full blur-2xl" />
          
          <div className="flex items-center justify-between border-b border-white/5 pb-3.5 mb-4">
            <div>
              <span className="text-[9px] text-lime-400 font-bold uppercase tracking-widest font-mono block">
                PRN SENSOR HUB v3
              </span>
              <h3 className="text-sm font-display font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-lime-400 animate-pulse" />
                ตัวสแกนวิเคราะห์ไม้แบด IoT
              </h3>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
              sensorStatus === "connected" ? "bg-lime-950/80 text-lime-400 border border-lime-800/20" :
              sensorStatus === "calibrating" ? "bg-amber-950 text-amber-300 border border-amber-800/30 animate-pulse" :
              "bg-slate-900 text-slate-400"
            }`}>
              {sensorStatus === "connected" && "● Connected"}
              {sensorStatus === "calibrating" && "⚙️ calibrating..."}
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            เชื่อมสัญญานบลูทูธวิเคราะห์ความคล่องตัวหน้าไม้และความถูกต้องในการยึดจับสัมผัส V-Shape ตีแตะจุดปะทะที่ดีที่สุด
          </p>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4 text-center">
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">
              Sweet Spot Landing Accuracy
            </span>
            <span className="text-3xl font-display font-extrabold text-white">
              {sweetSpotVal}%
            </span>
            <div className="w-full bg-slate-850 h-2 rounded-full overflow-hidden mt-3 relative">
              <div 
                className="h-full bg-lime-400 transition-all duration-1000" 
                style={{ width: `${sweetSpotVal}%` }} 
              />
            </div>
            <span className="text-[9px] text-slate-400 block mt-2 text-left">
              *ค่าเฉลี่ยสากลผู้เล่นระดับโปร: 85%+ • คุณพัฒนาดวงตาเข้าจุดตกคอร์ทหน้าเน็ตแม่นยำ
            </span>
          </div>

          <button
            id="btn-calibrate-racket-sensor"
            disabled={sensorStatus === "calibrating"}
            onClick={simulateSensorCalibrate}
            className="w-full bg-lime-400 hover:bg-lime-500 text-indigo-955 disabled:opacity-50 font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 ${sensorStatus === "calibrating" ? "animate-spin" : ""}`} />
            {sensorStatus === "calibrating" ? "กำลังปรับจูนสมดุลเซนเซอร์..." : "ปรับสมดุลหน้าไม้พรีเมียม (Calibrate)"}
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Recharts visualizer charts */}
      <div className="xl:col-span-8 flex flex-col gap-6">
        {/* Weekly Activities and Energy line chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-150 dark:border-slate-805 pb-4 mb-6">
            <div>
              <h3 className="text-base font-display font-bold text-slate-800 dark:text-slate-100">
                สถิติระยะเวลาวิ่งและเบิร์นสปีดรายสัปดาห์
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                เปรียบเทียบชั่วโมงใช้สอยบวกแคลอรีจากเซนเซอร์คาดเข่าในการออกกำลังของเดือนนี้
              </p>
            </div>
          </div>

          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={WEEKLY_ACTIVITY_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1e293b", 
                    borderColor: "#334155", 
                    color: "#f8fafc",
                    borderRadius: "12px",
                    fontSize: "11px"
                  }} 
                />
                <Legend formatter={(value) => <span className="text-xs font-semibold text-slate-500">{value === "minutes" ? "เวลาเล่นคอร์ทกิโลเมตร (Mins)" : "พลังงานหัวใจ (Calories burned)"}</span>} />
                <Line type="monotone" dataKey="minutes" stroke="#6366f1" strokeWidth={3} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="calories" stroke="#10b981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Smash Velocities progression bar charts & Radar competencies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Smash Velocity progressions */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h4 className="text-sm font-display font-bold text-slate-800 dark:text-slate-100 mb-2">
              ประวัติความตระหนักรู้สปีดตบสูงสุด (Smash Velocities)
            </h4>
            <p className="text-xs text-slate-400 mb-6">ความก้าวหน้าการคว่ำส่งไม้ข้อมือ (Forearm Pronation)</p>

            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SMASH_SPEEDS_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.4} />
                  <XAxis dataKey="session" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} unit=" km" />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: "#1e293b", 
                      borderColor: "#334155", 
                      borderRadius: "8px",
                      fontSize: "10px",
                      color: "#fff"
                    }}
                  />
                  <Legend formatter={(value) => <span className="text-[10px] font-bold text-slate-400">{value === "forehandSmash" ? "ตบลูกโฟร์แฮนด์" : "เซฟลูกแบ็คแฮนด์"}</span>} />
                  <Bar dataKey="forehandSmash" fill="#ca8a04" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="backhandSmash" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Radar Skills */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-display font-bold text-slate-800 dark:text-slate-100 mb-2">
                แผนภาพแมงมุมทักษะเทคนิค (Tactical Star Attribute)
              </h4>
              <p className="text-xs text-slate-400 mb-4">แสดงจุดอัจฉริยะในด่านทดสอบและสมรรถภาพของโค้ชฟันธง</p>
            </div>

            <div className="w-full h-56 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={BADMINTON_RADAR_SKILLS}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="attribute" stroke="#94a3b8" fontSize={8} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" fontSize={8} />
                  <Radar name="สมรรถภาพทักษะ" dataKey="value" stroke="#312e81" fill="#4f46e5" fillOpacity={0.45} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
