/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { UserProfile, AcademyModule } from "../types";
import { motion, AnimatePresence } from "motion/react";
import {
  GraduationCap,
  Play,
  CheckCircle,
  HelpCircle,
  Award,
  BookOpen,
  ArrowRight,
  Download,
  Flame,
  Volume2,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

interface OnlineAcademyProps {
  user: UserProfile;
  onChangeUser: (updated: UserProfile) => void;
}

const ACADEMY_CURRICULUM: AcademyModule[] = [
  {
    id: "mod-1",
    title: "1. ทักษะจับไม้และฟุตเวิร์คพื้นฐาน (Grip & Footwork Fundamentals)",
    titleThai: "การเปลี่ยนสปีดคอร์ทและความคล่องตัว",
    lessons: [
      {
        id: "les-1-1",
        title: "Forehand & Backhand Grip Methods",
        titleThai: "เทคนิคการจับไม้หน้ามือและหลังมือแบบ V-Shape",
        duration: "10 mins",
        difficulty: "Beginner",
        description: "การเรียนรู้มุมจับหน้าไม้เพื่อควบคุมทิศทางลูกหยอดและลูกเคลียร์ได้อย่างสมบูรณ์แบบเพื่อหลีกเลี่ยงการจับไม้รูปหน้ากระทะ",
        descriptionThai: "วีแชป (V-Shape) คือพื้นฐานจุดหมุนของข้อนิ้วโป้งและนิ้วชี้ในการรีดพลังตบและสะบัดข้อมือที่ดีที่สุด",
        youtubeId: "weNAgCeN7to",
        points: 100,
        steps: [
          { title: "ขั้นตอนที่ 1: V-Shape Alignment", details: "วางสันไม้แบดมินตันระหว่างนิ้วโป้งและนิ้วชี้ ปรับมุมสัมผัสหลวมระนาบตรง" },
          { title: "ขั้นตอนที่ 2: Backhand Thumb Lever", details: "เลื่อนนิ้วโป้งขึ้นมากดดันแป้นแบนของด้ามจับช่วยเพิ่มแรงดีดลูกหลังมือ" },
          { title: "ขั้นตอนที่ 3: Finger relaxation", details: "กำด้ามจับด้วยความผ่อนคลาย บีบไม้เฉพาะเสี้ยววินาทีที่หน้าไม้กระทบกับลูก" },
        ],
      },
      {
        id: "les-1-2",
        title: "Six-Point Court Mobility Movement",
        titleThai: "การก้าวเท้าเคลื่อนที่ 6 จุดอเนกประสงค์",
        duration: "15 mins",
        difficulty: "Beginner",
        description: "หลักสูตรฝึกซ้อมสเต็ปฟุตเวิร์คการสไลด์และถอยก้าวคอร์ทแบดเพื่อเข้าจุดตีได้รวดเร็วที่สุดโดยสูญเสียพลังงานน้อยที่สุด",
        descriptionThai: "รวมตำแหน่งวิ่งไปแดนหน้า กลาง และหลัง ครอบคลุมทั่วทั้งสนาม",
        youtubeId: "a7ajExQKOvY",
        points: 100,
        steps: [
          { title: "ขั้นตอนที่ 1: Chassé Step", details: "เคลื่อนที่สไลด์ด้านข้างโดยไม่กระโดดข้ามขาสลับคอยควบคุมสมดุลลำตัว" },
          { title: "ขั้นตอนที่ 2: Final Lunge", details: "ก้าวเท้านำตัวตีออกไปข้างหน้าพร้อมงอเข่าขวาทำมุม 90 องศาเพื่อรักษาน้ำหนักสะโพก" },
          { title: "ขั้นตอนที่ 3: Recover Push", details: "ออกแรงถีบข้อเท้าขวาเพื่อสปริงตัวถอยกลับมาจุดกึ่งกลางสนาม (Center Court)" },
        ],
      },
    ],
    quiz: [
      {
        id: "qz-1-1",
        question: "การจับไม้แบบ Forehand V-Shape ร่องนิ้วหัวแม่มือและนิ้วชี้ควรอยู่พิกัดใดของด้ามจับเป็นหลัก?",
        options: [
          "อยู่ด้านแนวแบนกว้างที่สุดของด้ามจับ",
          "อยู่ระนาบเดียวกับขอบสัน (Apex) ของด้ามไม้",
          "กำหลวมเป็นรูปวงกลมโดยไม่ต้องมีจุดสังเกต",
          "จับบริเวณส่วนบนสุดใกล้คอไม้ให้แน่นที่สุดตลอดเวลา",
        ],
        correctIndex: 1,
        explanation: "ร่อง V-Shape ระหว่างนิ้วโป้งและนิ้วชี้จะอยู่ระนาบเดียวกับแนวสันไม้ เพื่อให้เราสามารถปรับหน้าไม้ Forehand และตัดเฉือนได้อย่างอิสระ",
      },
      {
        id: "qz-1-2",
        question: "ในการทำ Lunge (ก้าวเท้านำตัวเข้ากระแทกตีลูกหน้าเน็ต) จุดสำคัญในการรักษาความปลอดภัยของหัวเข่าคือข้อใด?",
        options: [
          "เหยียดงอเข่าให้สุดเลยปลายเท้ายิ่งยืดยาวข้ามแดนยิ่งดี",
          "งอเชิดเท้านำขนานยึดเข่าให้มุมต้นขาทำมุม 90 องศา และเข่าไม่ส่งน้ำหนักเกินแนวปลายเท้า",
          "ยืนสองขากว้างเกร็งก้าวตรงไม่ยอมงอข้อเท้า",
          "ให้เข้าปรีสไลด์เอาน้ำหนักลื่นไหลทั้งหมดลงไปที่หัวเข่าซ้าย",
        ],
        correctIndex: 1,
        explanation: "การรักษาทิศทางเข่าไม่ให้เลยปลายเท้าและรักษาข้อเข่าขวาไว้ที่ประมาณ 90 องศา ป้องกันการบาดเจ็บรุนแรงของเส้นเอ็นกระดูกข้อเข่า",
      },
    ],
  },
  {
    id: "mod-2",
    title: "2. การเล่นลูกหยอดและพุชลึก (Precision Drops & Clears)",
    titleThai: "เทคนิคการตัดทิศทางและกดดันแดนหลัง",
    lessons: [
      {
        id: "les-2-1",
        title: "Forehand Slicing Drop Shot",
        titleThai: "ลูกตัดหยอดปั่นสปินหน้าเน็ตยอดเยี่ยม",
        duration: "12 mins",
        difficulty: "Intermediate",
        description: "วิธีการหั่นหน้าไม้สัมผัสด้านข้างของขนนกเบาๆ ทำให้วิถีลูกเลียดตาข่ายม้วนตกลงอย่างฉับพลัน",
        descriptionThai: "ผู้เล่นตรงข้ามเดาจุดตกยากเนื่องจากเป็นท่าเลียนแบบลูกตบหัวไหล่เดียวกัน",
        youtubeId: "K32fSOgKcaY",
        points: 150,
        steps: [
          { title: "ขั้นตอนที่ 1: Same Setup As Smash", details: "ตั้งหลักโยนไหล่และเหยียดมือซ้ายขึ้นทำท่าตบลูกเรียกร้องจุดสังเกตจากคู่ต่อสู้" },
          { title: "ขั้นตอนที่ 2: Soft Slicing angle", details: "จังหวะส่งไม้ให้หมุนเอียงหน้าไม้ 30 องศาตัดหั่นแฉลบข้างขอบหัวลูกแทนการปะทะตรง" },
          { title: "ขั้นตอน&nbsp;3: Net Rolling follow-through", details: "หยุดสะบัดข้อมือเบรกแรงผลักช่วยให้ลูกเฉียดเน็ตแนวนอนตกทันที" },
        ],
      },
    ],
    quiz: [
      {
        id: "qz-2-1",
        question: "ข้อดีหลักที่ใช้ท่าเตรียมแบบเดียวกับลูกตบ (Smash Setup) ในการเล่นลูกตัดหยอด (Slicing Drop) คือข้อใด?",
        options: [
          "เพื่อเพิ่มพลังตัดลูกให้เกิดเสียงดังกระหึ่มขึ้น",
          "เพื่อหลอกล่อให้คู่ต่อสู้อยู่ในโซนถอยหลังและตั้งหลักรับตบ ป้องกันการเข้ามาแย่งตะครุบหน้าเน็ต",
          "เพื่อให้ข้อมือไม่เหนื่อยจากการขยับ",
          "ทำให้ตัวไม้หมุนได้ 360 องศา",
        ],
        correctIndex: 1,
        explanation: "การทำ Deception (หลอกล่อ) ด้วยการใช้วงสวิงท่าเดียวกันทำให้คู่ต่อสู้จับจังหวะวิถีไม่ได้ และถอยคอร์ทเพื่อคอยรับสแมช",
      },
    ],
  },
  {
    id: "mod-3",
    title: "3. ลูกตบทรงอิทธิพลระดับมาสเตอร์ (Powerful Smash Masterclass)",
    titleThai: "ระเบิดความเร็วลูกบดขยี้แนวรับ",
    lessons: [
      {
        id: "les-3-1",
        title: "Kinetic Chain Power Transfer",
        titleThai: "การต่อยอดสายโซ่จุลภาพถีบสะโพกส่งแรงตบถล่มทลาย",
        duration: "20 mins",
        difficulty: "Advanced",
        description: "เรียนรู้พิกัดสวิงโถมน้ำหนักส่งถ่ายน้ำหนักลำตัวจาก ปลายเท้า-สะโพก-หัวไหล่ และข้อมือ เพื่อรีดสปีดลูกตบทะลุ 350+ km/h",
        descriptionThai: "วิธีตบแบบถูกต้องเพื่อถนอมเซฟข้อศอกและไหล่พาวเวอร์ฟูล",
        youtubeId: "H7kpZ9inc10",
        points: 200,
        steps: [
          { title: "ขั้นตอนที่ 1: Body Coiling Setup", details: "ยืนด้านข้างบิดหัวไหล่ขวาไปข้างหลัง บิดสะโพกเปิดหน้าอกรับพลังสะสมคล้ายคันธนู" },
          { title: "ขั้นตอนที่ 2: Hip Rotation Core Drive", details: "หมุนสะโพกสวนทางอย่างรุนแรง โยนไหล่ขวาเหยียดเข้าหาจุดตีก่อนฟาด" },
          { title: "ขั้นตอนที่ 3: Forearm pronation", details: "คว่ำปลายท่อนแขนสะบัดสแน็ปข้อมือวินาทีสุดท้ายเพื่อให้จุดตกพุ่งทะลุดิ่งลงล่างสุด" },
        ],
      },
    ],
    quiz: [
      {
        id: "qz-3-1",
        question: "ข้อใดคือการทำงานของสายโซ่จลนศาสตร์ (Kinetic Chain) ที่ถูกต้องในการกระตุ้นแรงตบสูงสุด?",
        options: [
          "ใช้แรงแผ่ออกจากข้อมืออย่างเดียวโดยไม่ต้องอาศัยสะโพกบิด",
          "ถ่ายพลังสปริงตัวจาก ขา -> บิดสะโพก -> การส่งหัวไหล่ -> คว่ำข้อศอกและท่อนแขน (Pronation)",
          "กระโดดตบโดยห้ามใช้กล้ามเนื้อท้องเกร็งตัว",
          "ต้องเกร็งกล้ามเนื้อหงายหน้ามือหั่นแนวราบตีออกด้านบนคอร์ส",
        ],
        correctIndex: 1,
        explanation: "การส่งต่อแรงสืบเนื่องจากกล้ามเนื้อมัดใหญ่ของท่อนขาและสะโพกไล่ลำดับส่งต่อมายังไหล่ แขน และลงไปสะบัดสแนปหน้าไม้จังหวะสุดท้ายเพิ่มความเร็วลูกตบแบบยกกำลังสอง",
      },
    ],
  },
];

export default function OnlineAcademy({ user, onChangeUser }: OnlineAcademyProps) {
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: string]: number }>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [playerViewMode, setPlayerViewMode] = useState<"video" | "simulation">("video");
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [localPassedModules, setLocalPassedModules] = useState<string[]>([]);

  const currentModule = ACADEMY_CURRICULUM[activeModuleIndex];
  const currentLesson = currentModule.lessons[activeLessonIndex] || currentModule.lessons[0];

  // Merge server state + local optimistic state to avoid stale closure issues
  const allPassedModules = Array.from(new Set([...user.completedQuizzes, ...localPassedModules]));

  // Calculate if qualified for certificate
  const isModuleQuizPassed = (modId: string) => {
    return allPassedModules.includes(modId);
  };

  const isAllModulesPassed = ACADEMY_CURRICULUM.every((mod) =>
    allPassedModules.includes(mod.id)
  );

  const handleSelectAnswer = (qId: string, optIdx: number) => {
    setQuizAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    // Validate all answered
    const unanswered = currentModule.quiz.some((q) => quizAnswers[q.id] === undefined);
    if (unanswered) {
      setQuizError("⚠️ กรุณาตอบคำถามให้ครบทุกข้อก่อนการส่งคำตอบครับ");
      return;
    }
    setQuizError(null);

    // Compute score
    let correctCount = 0;
    currentModule.quiz.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const is100Percent = correctCount === currentModule.quiz.length;
    setQuizScore(correctCount);
    setQuizSubmitted(true);

    if (is100Percent) {
      // Mark as completed module — update local state immediately (avoid stale closure)
      if (!allPassedModules.includes(currentModule.id)) {
        setLocalPassedModules((prev) => [...prev, currentModule.id]);
        onChangeUser({
          ...user,
          completedQuizzes: Array.from(new Set([...user.completedQuizzes, currentModule.id])),
        });
      }
    }
  };

  const handleResetQuiz = () => {
    setQuizSubmitted(false);
    setQuizAnswers({});
    setQuizScore(null);
    setQuizError(null);
  };

  // PROGRAM-LEVEL CANVAS CERTIFICATE COMPILER
  const generateAndDownloadCertificateImage = (e: React.MouseEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Redraw on canvas to make sure we render fresh details
    // Canvas dimensions: 1200 x 850 (High Definition aspect)
    canvas.width = 1200;
    canvas.height = 850;

    // 1. Solid Off-White Parchment Background
    ctx.fillStyle = "#FDFBF7";
    ctx.fillRect(0, 0, 1200, 850);

    // 2. Forest Emerald Border Framework
    ctx.lineWidth = 15;
    ctx.strokeStyle = "#064E3B"; // emerald-950
    ctx.strokeRect(20, 20, 1160, 810);

    // Dynamic Golden Corner Accents
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#D97706"; // amber-600
    ctx.strokeRect(35, 35, 1130, 780);

    // Drawing ornamental corners
    ctx.fillStyle = "#D97706";
    // Top-Left corner
    ctx.fillRect(35, 35, 40, 40);
    // Top-Right corner
    ctx.fillRect(1125, 35, 40, 40);
    // Bottom-Left corner
    ctx.fillRect(35, 775, 40, 40);
    // Bottom-Right corner
    ctx.fillRect(1125, 775, 40, 40);

    // 3. Header Texts
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "#064E3B";
    ctx.font = "bold 24px 'Space Grotesk', 'Inter', sans-serif";
    ctx.fillText("PRN BADMINTON ARENA & ONLINE ACADEMY", 600, 100);

    ctx.fillStyle = "#D97706";
    ctx.font = "bold 56px 'Space Grotesk', 'Inter', sans-serif";
    ctx.fillText("CERTIFICATE OF EXCELLENCE", 600, 175);

    ctx.fillStyle = "#6B7280"; // gray-500
    ctx.font = "italic 18px 'Inter', sans-serif";
    ctx.fillText("เกียรติบัตรรับรองความรู้ทางทักษะกีฬาแบดมินตัน", 600, 235);

    // 4. Recipient details
    ctx.fillStyle = "#374151"; // gray-700
    ctx.font = "medium 20px 'Inter', sans-serif";
    ctx.fillText("เกียรติบัตรฉบับนี้ให้ไว้เพื่อแสดงว่า (This is to certify that)", 600, 310);

    // Heavy Royal name rendering
    ctx.fillStyle = "#064E3B";
    ctx.font = "bold 44px 'Space Grotesk', 'Inter', sans-serif";
    ctx.fillText(user.name, 600, 390);

    // Underline name decoration
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#D97706";
    ctx.beginPath();
    ctx.moveTo(350, 420);
    ctx.lineTo(850, 420);
    ctx.stroke();

    // Course completion description
    ctx.fillStyle = "#374151";
    ctx.font = "18px 'Inter', sans-serif";
    ctx.fillText("ได้ผ่านการเรียน อบรม และทดสอบความเชี่ยวชาญทักษะเฉพาะด้านตามหลักสูตรรวม", 600, 475);

    ctx.fillStyle = "#064E3B";
    ctx.font = "bold 22px 'Space Grotesk', 'Inter', sans-serif";
    ctx.fillText("BADMINTON PRO MASTERCLASS (ทักษะจับไม้ ฟุตเวิร์ค ลูกหยอด และลูกตบความเร็วสูง)", 600, 520);

    ctx.fillStyle = "#6B7280";
    ctx.font = "16px 'Inter', sans-serif";
    ctx.fillText("ขอจดจำความเป็นผู้รู้ มีความตั้งใจ มุ่งมั่นฝึกฝนพัฒนาประสิทธิภาพความเป็นเลิศตลอดไป", 600, 565);

    // 5. Verification Block (Footer row)
    // Left Signer
    ctx.fillStyle = "#111827";
    ctx.font = "bold 18px 'Inter', sans-serif";
    ctx.fillText("PRN Badminton Center", 280, 680);
    ctx.font = "14px 'Inter', sans-serif";
    ctx.fillStyle = "#6B7280";
    ctx.fillText("ผู้ควบคุมการสอนและจัดฝึกคิว", 280, 710);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "#D1D5DB";
    ctx.beginPath();
    ctx.moveTo(150, 660);
    ctx.lineTo(410, 660);
    ctx.stroke();

    // Center Golden stamp vector placeholder circle
    ctx.beginPath();
    ctx.arc(600, 680, 50, 0, 2 * Math.PI);
    ctx.fillStyle = "#F59E0B";
    ctx.fill();
    ctx.strokeStyle = "#D97706";
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 13px 'Space Grotesk', sans-serif";
    ctx.fillText("VERIFIED", 600, 672);
    ctx.font = "bold 11px 'Space Grotesk', sans-serif";
    ctx.fillText("★ PRN ★", 600, 692);

    // Right Signer
    ctx.fillStyle = "#111827";
    ctx.font = "bold 18px 'Inter', sans-serif";
    ctx.fillText("สถาบันอบรมแบดมินตันออนไลน์", 920, 680);
    ctx.font = "14px 'Inter', sans-serif";
    ctx.fillStyle = "#6B7280";
    ctx.fillText("ผู้อำนวยการฝ่ายการท่องเที่ยวและกีฬา", 920, 710);
    ctx.beginPath();
    ctx.moveTo(790, 660);
    ctx.lineTo(1050, 660);
    ctx.stroke();

    // Custom security certificate numbers in margin
    ctx.fillStyle = "#9CA3AF";
    ctx.font = "font-mono 12px 'Inter', sans-serif";
    ctx.fillText(`Verification Code ID: PRN-${user.memberId}-${new Date().getFullYear()}`, 600, 770);

    // Trigger instant browser download
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `Certificate-${user.name.replace(/\s+/g, "_")}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* LEFT COMPONENT: Sidebar curriculum module trees */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <h3 className="text-lg font-display font-bold text-indigo-950 flex items-center gap-2 mb-1">
          <BookOpen className="text-indigo-900 w-5 h-5" />
          บทเรียนและหลักสูตรแบด (600 EXP)
        </h3>

        <div className="flex flex-col gap-2.5">
          {ACADEMY_CURRICULUM.map((mod, index) => {
            const isActive = activeModuleIndex === index;
            const isPassed = isModuleQuizPassed(mod.id);

            return (
              <div
                key={mod.id}
                onClick={() => {
                  setActiveModuleIndex(index);
                  setActiveLessonIndex(0);
                  handleResetQuiz();
                }}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  isActive
                    ? "bg-indigo-950 border-indigo-950 text-white shadow-md relative"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex justify-between items-start gap-1">
                  <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                    isActive ? "bg-lime-400 text-indigo-950" : "bg-slate-100 text-slate-500"
                  }`}>
                    {isPassed ? "🏆 ผ่านแล้ว" : "📖 ในการสอน"}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">+{mod.lessons.length * 100} EXP</span>
                </div>

                <h4 className={`text-sm font-bold tracking-wide whitespace-normal mt-2 ${
                  isActive ? "text-lime-350" : "text-slate-850"
                }`}>
                  {mod.title}
                </h4>
                <p className={`text-xs mt-1 truncate ${isActive ? "text-slate-300" : "text-slate-400"}`}>
                  {mod.titleThai}
                </p>

                <div className="flex items-center gap-2 mt-3.5 pt-2 border-t border-slate-200/10 text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-semibold">
                    <Play className="w-3 h-3 text-lime-400" />
                    {mod.lessons.length} บทเรียนย่อย
                  </span>
                  <span>•</span>
                  <span>ควิซท้ายบท 1 ชุด</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Certificate Portal status bar */}
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-955 text-white p-5 rounded-2xl shadow-md border border-indigo-950 mt-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl" />
          <div className="relative">
            <h4 className="text-xs text-lime-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-lime-400" />
              ใบรับรองจบหลักสูตร (Certificate)
            </h4>
            <p className="text-xs text-slate-300/90 leading-relaxed mb-4">
              เรียนครบและสอบควิซผ่าน 100% ครบทุก 3 ยูนิตเดี่ยวเพื่อออกสัมปทานบัตรเกียรติบัตรรับรองวิทยฐานะโค้ชชิ่งของคุณทันที!
            </p>

            <div className="flex items-center justify-between bg-white/10 px-3.5 py-2.5 rounded-xl border border-white/10 mb-4 text-xs font-mono">
              <span>สถานะของคุณ:</span>
              <strong className={isAllModulesPassed ? "text-lime-400" : "text-amber-350"}>
                {isAllModulesPassed ? "🎯 พร้อมรับเกียรติบัตร" : `${user.completedQuizzes.length} / 3 ผ่านแล้ว`}
              </strong>
            </div>

            {isAllModulesPassed ? (
              <button
                id="btn-trigger-cert"
                onClick={() => setIsCertificateModalOpen(true)}
                className="w-full bg-lime-400 hover:bg-lime-500 text-indigo-955 font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-lg shadow-lime-400/20 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                รับเกียรติบัตรของคุณที่นี่ (Get Certificate)
              </button>
            ) : (
              <div className="w-full text-center bg-white/5 border border-white/5 text-slate-400 font-medium py-2 rounded-xl text-xs flex items-center justify-center gap-1">
                🔓 ต้องผ่านควิซก่อนเพื่อปลดล็อกเกียรติบัตร
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT COMPONENT: Active study guide / simulated video player & quiz screen */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        {/* Dynamic Study Header tab switch (Lesson vs Practice Quiz) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
            <div>
              <span className="text-[10px] bg-indigo-55 text-indigo-900 border border-indigo-200 font-bold px-2 py-0.5 rounded font-mono">
                {currentLesson.difficulty.toUpperCase()} MODULE
              </span>
              <h2 className="text-lg font-display font-bold text-slate-800 mt-1">
                {currentLesson.titleThai}
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-slate-400 font-mono">
              บทเรียนที่ {activeLessonIndex + 1} จาก {currentModule.lessons.length}
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-6">{currentLesson.description}</p>

          {/* NEW TABBED PLAYER VIEW: YouTube Video vs Tactical Board */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 mb-4 gap-2">
            <button
              id="player-tab-video"
              onClick={() => setPlayerViewMode("video")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                playerViewMode === "video"
                  ? "bg-indigo-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className="text-base">📺</span> วิดีโอสอนจริงจาก YouTube
            </button>
            <button
              id="player-tab-sim"
              onClick={() => setPlayerViewMode("simulation")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                playerViewMode === "simulation"
                  ? "bg-indigo-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className="text-base">🎨</span> กระดานสเต็ปโมชันแทคติกจำลอง
            </button>
          </div>

          {/* PLAYER GRID CONTAINER */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch mb-6">
            <div className="md:col-span-8 bg-slate-950 rounded-2xl relative overflow-hidden aspect-video border border-slate-800 flex flex-col items-center justify-center text-white">
              {playerViewMode === "video" && currentLesson.youtubeId ? (
                <a
                  href={`https://www.youtube.com/watch?v=${currentLesson.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-4 group"
                >
                  <div className="w-20 h-20 bg-red-600 group-hover:bg-red-500 rounded-full flex items-center justify-center transition-all shadow-2xl shadow-red-900/50">
                    <svg className="w-9 h-9 text-white fill-white pl-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                  <div className="text-center px-6">
                    <p className="text-sm font-bold text-white">{currentLesson.titleThai}</p>
                    <p className="text-xs text-slate-400 mt-1">คลิกเพื่อดูวิดีโอบน YouTube</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700">
                    🔗 youtube.com/watch?v={currentLesson.youtubeId}
                  </span>
                </a>
              ) : (
                <>
                  {/* Fake player container */}
                  <div className="absolute inset-0 bg-radial-gradient(circle_at_center, rgba(163,230,53,0.08), transparent_70%)" />
                  
                  {/* Simulated court baseline grid lines */}
                  <div className="absolute inset-x-0 bottom-1/4 h-0.5 bg-white/10" />
                  <div className="absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-white/10 border-dashed" />
                  <div className="absolute w-0.5 h-full top-0 left-1/2 bg-white/5" />

                  {/* Court graphics showing real hits */}
                  <div className="relative z-10 p-4 text-center max-w-sm">
                    <div className="w-16 h-16 bg-indigo-900/40 border border-indigo-400 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                      <Play className="text-lime-400 w-7 h-7 fill-lime-400 pl-0.5" />
                    </div>
                    <h5 className="text-xs font-semibold tracking-wider text-slate-200">วิดีโออนิเมชันสาธิตจลศาสตร์ข้อเหวี่ยง</h5>
                    <p className="text-[10px] text-slate-400 mt-1">
                      การเคลื่อนไหวสโลว์โมชันวิธีกดข้อมือสะบัดลวงตา คุมด้วยทักษะ {currentLesson.title}
                    </p>
                  </div>

                  {/* Status bar */}
                  <div className="absolute bottom-4 inset-x-4 bg-slate-900/90 backdrop-blur border border-white/5 px-3 py-1.5 rounded-lg flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <Volume2 className="w-3.5 h-3.5 text-lime-400" /> AUTO VOICE COACHING: ACTIVE
                    </span>
                    <span className="text-lime-400 font-bold font-mono">1080P AUDIO PRO</span>
                  </div>
                </>
              )}
            </div>

            {/* Drill execution steps card next to video */}
            <div className="md:col-span-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  ขั้นตอนทดสอบการฝึกซ้อม (Drills)
                </h4>
                <div className="space-y-3.5">
                  {currentLesson.steps.map((st, sidx) => (
                    <div key={sidx} className="flex gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-indigo-900 text-white font-mono font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        {sidx + 1}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-700 block">{st.title}</span>
                        <span className="text-[10px] text-slate-400 block leading-normal mt-0.5">{st.details}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 mt-4 text-center">
                <span className="inline-block text-[10px] font-bold text-lime-900 bg-lime-100/60 border border-lime-305 px-2 py-0.5 rounded">
                  💡 ฝึกหน้าเสาหรือผนังคอร์ทวันละ 15 นาที
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg text-slate-500 text-xs border border-slate-200">
            <span>บทต่อไป: {currentModule.lessons[activeLessonIndex + 1]?.titleThai || "ควิซวัดประเมินผล"}</span>
            <div className="flex gap-2">
              {activeLessonIndex < currentModule.lessons.length - 1 ? (
                <button
                  id="btn-next-lesson"
                  onClick={() => { setActiveLessonIndex((prev) => prev + 1); handleResetQuiz(); }}
                  className="bg-indigo-900 hover:bg-indigo-805 text-white font-bold py-1 px-3 rounded text-xs flex items-center gap-1 cursor-pointer transition-all"
                >
                  เรียนบทถัดไป
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="text-[11px] text-slate-500 font-mono font-semibold uppercase">
                  💡 เรียนออนไลน์ครบแล้วกรุณาทำแบบฝึกทดสอบควิซด้านล่าง
                </span>
              )}
            </div>
          </div>
        </div>

        {/* COMPREHENSIVE PRACTICE QUIZZES UNIT PANEL */}
        <div id="quiz-block" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="text-indigo-900 w-5 h-5" />
            <h3 className="text-base font-display font-bold text-slate-800">
              แบบทดสอบควิซประจำบทเรียน: {currentModule.title.split(". ")[1]}
            </h3>
          </div>

          {!quizSubmitted ? (
            <div className="space-y-6">
              {currentModule.quiz.map((q, qidx) => {
                const selectedAns = quizAnswers[q.id];
                return (
                  <div key={q.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                    <p className="text-xs font-semibold text-slate-800 mb-2.5">
                      คำถามที่ {qidx + 1}: {q.question}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((opt, oidx) => {
                        const isChosen = selectedAns === oidx;
                        return (
                          <button
                            key={oidx}
                            id={`quiz-q-${q.id}-${oidx}`}
                            onClick={() => handleSelectAnswer(q.id, oidx)}
                            className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center gap-2 ${
                              isChosen
                                ? "bg-indigo-50 border-indigo-500 text-indigo-900 font-semibold"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] ${
                              isChosen ? "bg-indigo-900 text-white border-indigo-900" : "border-slate-300"
                            }`}>
                              {oidx + 1}
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {quizError && <p className="text-xs text-red-500 font-semibold text-center">{quizError}</p>}

              <button
                id="btn-submit-quiz"
                onClick={handleSubmitQuiz}
                className="w-full bg-indigo-900 hover:bg-indigo-805 text-white font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                ส่งคำตอบควิซรอบนี้
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="text-center py-6">
              <span className="text-3xl">🎯</span>
              <h4 className="text-lg font-bold text-slate-800 mt-2">ประเมินผลคะแนนเสร็จสิ้น!</h4>
              
              <div className="my-4 max-w-md mx-auto p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono">
                <p className="text-sm">คะแนนที่ทำได้:</p>
                <span className="text-3xl font-bold text-indigo-900">
                  {quizScore} / {currentModule.quiz.length} คะแนน
                </span>
                <p className="text-[10px] text-slate-400 mt-1">
                  หมายเหตุ: ท่านต้องทดสอบตอบถูก 100% ครบทุกข้อเพื่อรับสิทธ์ผ่านโมดูลหลักสูตรนี้
                </p>
              </div>

              {quizScore === currentModule.quiz.length ? (
                <div className="text-xs text-lime-800 font-bold bg-lime-100/60 p-3 rounded-lg max-w-sm mx-auto border border-lime-300">
                   ยินดีด้วยครับ! คุณตอบผ่านถูกต้องครบถ้วน 100%! <br />
                  <span className="font-semibold block mt-1">
                    ระบบอัปเดตสถานะของยูนิต {currentModule.id} เรียบร้อย สั่งสะสมแต้ม 100 แต้ม!
                  </span>
                </div>
              ) : (
                <div className="text-xs text-amber-700 font-bold bg-amber-50 p-3 rounded-lg max-w-sm mx-auto border border-amber-200">
                  ⚠️ น่าเสียดาย! คุณยังตอบไม่ถูกครบทุกข้อเฉลย <br />
                  <span className="font-normal block text-slate-500 mt-1">
                    คำทำนาย: ท่าจับไม้ V-Shape หรือ Lunge เข่า 90 องศา เป็นจุดสำคัญ ลองทบทวนวิดีอีกครั้งนะ
                  </span>
                </div>
              )}

              <div className="flex gap-2 justify-center mt-6">
                <button
                  id="btn-retry-quiz"
                  onClick={handleResetQuiz}
                  className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 font-semibold py-2 px-4 rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> ทำใหม่อีกครั้ง
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FULL-STRENGHT HIDDEN GEOMETRIC CANVAS RENDERING CERTIFICATE DIALOG */}
      <AnimatePresence>
        {isCertificateModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-4xl w-full border border-slate-200 shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="text-lime-500 w-6 h-6" />
                  <h3 className="font-display font-bold text-slate-800 text-lg">
                    รับมอบเกียรติบัตรรับรองวิทยฐานะพอร์ท
                  </h3>
                </div>
                <button
                  id="btn-close-cert-modal"
                  onClick={() => setIsCertificateModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Visual Preview on Screen (CSS Beautiful Layout matching PDF style) */}
              <div className="p-1 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden relative shadow-inner">
                <div className="bg-amber-50/10 p-6 md:p-10 text-center border-4 border-indigo-900 rounded-xl relative">
                  <div className="absolute inset-2 border border-amber-500/30 font-medium pointer-events-none" />
                  <span className="text-[10px] font-mono tracking-widest text-indigo-900 font-bold block">
                    PRN BADMINTON CENTER & ONLINE COURT ACCREDITATION
                  </span>
                  <p className="text-2xl font-display font-bold text-amber-600 mt-2">CERTIFICATE OF EXCELLENCE</p>
                  <span className="text-xs text-slate-400 italic block mt-0.5">เกียรติบัตรรับรองความรู้ทักษะแบดมินตันอัจฉริยะ</span>

                  <p className="text-xs text-slate-600 mt-6">เกียรติบัตรฉบับนี้ออกไว้ให้เพื่อรับรองวิทยฐานะของ</p>
                  <h1 className="text-2xl md:text-3xl font-display font-extrabold text-indigo-900 my-3">
                    {user.name}
                  </h1>

                  <div className="w-1/2 h-0.5 bg-amber-500/60 mx-auto" />

                  <p className="text-xs text-slate-650 mt-4 leading-relaxed max-w-md mx-auto">
                    ผู้ซึ่งศึกษาหลักสูตรครบถ้วนและตอบคำถามการสอบประเมินยูนิตฟุตเวิร์ค (Footwork), ลูกหยอด (Slicing Cut), และลูกตบความเร็วสูง (Powerful Smash) ครบ 3 ระดับมาตรฐานระดับอาชีพ
                  </p>

                  {/* Signers mockup */}
                  <div className="flex justify-between items-center mt-12 px-6">
                    <div className="text-center">
                      <span className="text-[11px] font-bold text-slate-800 block">สถาบัน PRN Badminton Center</span>
                      <span className="text-[8px] text-slate-400 block border-t border-slate-200 pt-1 mt-1">ผู้ควบคุมตารางคิวและสนาม</span>
                    </div>
                    {/* Golden stamp icon */}
                    <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center text-indigo-950 border-2 border-amber-500 text-[8px] font-bold">
                      VERIFIED
                    </div>
                    <div className="text-center">
                      <span className="text-[11px] font-bold text-slate-800 block">ฝ่ายการเรียนรู้ออนไลน์</span>
                      <span className="text-[8px] text-slate-400 block border-t border-slate-200 pt-1 mt-1">ผู้อำนวยการส่วนเทคโนโลยีเพื่อเยาวชน</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hidden compile canvas */}
              <canvas ref={canvasRef} className="hidden" width={1200} height={850} />

              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <button
                  id="btn-download-cert"
                  onClick={generateAndDownloadCertificateImage}
                  className="w-full bg-indigo-900 hover:bg-indigo-805 text-white font-bold py-3 px-6 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-900/10 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  ดาวน์โหลดเป็นไฟล์รูปภาพความละเอียดสูง (.PNG Download)
                </button>
                <button
                  id="btn-close-cert-foot"
                  onClick={() => setIsCertificateModalOpen(false)}
                  className="w-full sm:w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-650 font-bold py-3 rounded-2xl text-xs transition-all cursor-pointer border border-slate-200"
                >
                  ปิดหน้าต่างนี้
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
