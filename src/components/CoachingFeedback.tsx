import React, { useState, useEffect } from "react";
import { 
  Star, 
  MessageSquare, 
  CheckCircle, 
  User, 
  Zap, 
  Send, 
  Smile, 
  FileText,
  ThumbsUp,
  Award
} from "lucide-react";
import { UserProfile } from "../types";

interface CoachingFeedbackProps {
  user: UserProfile;
  onChangeUser: (updated: UserProfile) => void;
}

interface FeedbackLog {
  id: string;
  coachName: string;
  rating: number;
  comments: string;
  date: string;
  expEarned: number;
  tacticsScore: number;
  physicalScore: number;
}

const PRESEEDED_FEEDBACKS: FeedbackLog[] = [
  {
    id: "fb-1-pre",
    coachName: "โค้ช ปรัชญา (Coach Prachya)",
    rating: 5,
    comments: "โค้ชอธิบายสเต็ป V-Shape เข้าใจง่ายมากครับ จากที่ไม่กล้าสะบัดไหล่ ตอนนี้ดีขึ้นผิดหูผิดตาเลย",
    date: "10 มิ.ย. 2569",
    expEarned: 50,
    tacticsScore: 9,
    physicalScore: 8
  }
];

export default function CoachingFeedback({ user, onChangeUser }: CoachingFeedbackProps) {
  const [coachName, setCoachName] = useState("โค้ช ปรัชญา (Coach Prachya)");
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState("");
  const [tacticsScore, setTacticsScore] = useState(8);
  const [physicalScore, setPhysicalScore] = useState(8);
  
  const [feedbackLogs, setFeedbackLogs] = useState<FeedbackLog[]>(() => {
    const saved = localStorage.getItem("prn_badminton_feedbacks");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
         // fallback
      }
    }
    return PRESEEDED_FEEDBACKS;
  });

  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comments.trim()) return;

    const newLog: FeedbackLog = {
      id: `fb-log-${Date.now()}`,
      coachName,
      rating,
      comments: comments.trim(),
      date: new Date().toLocaleDateString("th-TH", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }),
      expEarned: 50,
      tacticsScore,
      physicalScore
    };

    const updatedLogs = [newLog, ...feedbackLogs];
    setFeedbackLogs(updatedLogs);
    localStorage.setItem("prn_badminton_feedbacks", JSON.stringify(updatedLogs));

    // Reward XP +50 to user
    const updatedUser = {
      ...user,
      completedQuizzes: [...user.completedQuizzes, `feedback-${Date.now()}`] // Adding mock completed activity to earn more progress
    };
    onChangeUser(updatedUser);

    // Reset Form & Alert user
    setComments("");
    setRating(5);
    setTacticsScore(8);
    setPhysicalScore(8);
    setShowAlert(true);
    
    setTimeout(() => {
      setShowAlert(false);
    }, 4500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* LEFT COLUMN: Input Form */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-150 dark:border-slate-800 pb-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-lime-50 dark:bg-lime-950/40 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5 text-lime-600" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-slate-800 dark:text-slate-100">
                ฟอร์มประเมินและเสนอแนะผลโค้ชชิ่ง
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                ประเมินผลการเรียนส่วนตัว เพื่อให้ผู้ฝึกสอนรับทราบพฤติกรรมการฝึกซ้อมและการดูแลของคุณ
              </p>
            </div>
          </div>

          {showAlert && (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border-l-4 border-emerald-500 text-emerald-800 dark:text-emerald-400 p-4 rounded-xl text-xs mb-6 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>
                  <strong>ส่งผลตอบรับโค้ชชิ่งสำเร็จ!</strong> รับรางวัลขยันซ้อม <strong>+50 XP</strong> เรียบร้อยแล้วครับ
                </span>
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Select Coach */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                ผู้ฝึกสอนที่คุณเพิ่งเรียนด้วย
              </label>
              <select
                value={coachName}
                onChange={(e) => setCoachName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <option value="โค้ช ปรัชญา (Coach Prachya)">โค้ช ปรัชญา (Coach Prachya) - เสิร์ฟตบหัวไหล่มาสเตอร์</option>
                <option value="โค้ช เจน (Coach Jane)">โค้ช เจน (Coach Jane) - แทคติกโมบาลิตีความเร็วสูง</option>
                <option value="โค้ช อาร์ต (Coach Art)">โค้ช อาร์ต (Coach Art) - ดับเบิ้ลแมตช์วางแผนนัดซิกแซก</option>
              </select>
            </div>

            {/* Attributes sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-850">
              {/* Tactics points */}
              <div>
                <label className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  <span>คะแนนสอนแทคติกความเข้าใจ</span>
                  <span className="text-indigo-600 dark:text-lime-400 font-mono text-sm">{tacticsScore}/10</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={tacticsScore}
                  onChange={(e) => setTacticsScore(Number(e.target.value))}
                  className="w-full accent-indigo-900 cursor-pointer"
                />
              </div>

              {/* Physical point */}
              <div>
                <label className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  <span>คะแนนฝึกฝนความทรหดร่างกาย</span>
                  <span className="text-indigo-600 dark:text-lime-400 font-mono text-sm">{physicalScore}/10</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={physicalScore}
                  onChange={(e) => setPhysicalScore(Number(e.target.value))}
                  className="w-full accent-indigo-900 cursor-pointer"
                />
              </div>
            </div>

            {/* Stars score */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-405 uppercase tracking-wider mb-2">
                ระดับความพึงพอใจโดยรวม
              </label>
              <div className="flex items-center gap-1.5 py-1">
                {[1, 2, 3, 4, 5].map((st) => {
                  const active = rating >= st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setRating(st)}
                      className="p-1 cursor-pointer hover:scale-110 active:scale-95 transition-all text-amber-400"
                    >
                      <Star className={`w-8 h-8 ${active ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-700"}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Plain comments text area */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                รายละเอียดคำวิจารณ์ คำติชม หรือเป้าหมายที่คุณอยากปรับปรุงในครั้งถัดไป
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                required
                rows={4}
                placeholder="อธิบายทักษะที่เรียน ความลื่นไหลในการก้าวขา รวมถึงข้อเสนอแนะความเร็วลูกหยอดลูกตบ..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
              />
            </div>

            <button
              id="submit-feedback-btn"
              type="submit"
              className="w-full bg-indigo-900 hover:bg-indigo-950 text-white font-bold py-3.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
            >
              <Send className="w-4 h-4" />
              ส่งคำติชมเพื่อช่วยโค้ชพัฒนาการดูแลอัจฉริยะ (+50 XP)
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN: submitted feedback history */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="text-sm font-display font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 border-b border-slate-150 dark:border-slate-800 pb-3 mb-4">
            <FileText className="w-4 h-4 text-indigo-500" />
            ประวัติคำเสนอแนะของคุณ ({feedbackLogs.length} ข้อความ)
          </h3>

          <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
            {feedbackLogs.map((log) => (
              <div 
                key={log.id} 
                className="p-4 rounded-xl border border-slate-150 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/50 text-slate-700 dark:text-slate-350"
              >
                <div className="flex justify-between items-start gap-1 mb-2">
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                      {log.coachName}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {log.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200/50">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-300">
                      {log.rating}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed mb-3">
                  "{log.comments}"
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-851 text-[10px] text-slate-400">
                  <span className="bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded">
                    แทคติก: {log.tacticsScore}/10
                  </span>
                  <span className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded">
                    กายภาพ: {log.physicalScore}/10
                  </span>
                  <span className="ml-auto text-emerald-500 flex items-center gap-1 font-bold">
                    <Zap className="w-3 h-3 fill-emerald-500" /> +50 XP
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
