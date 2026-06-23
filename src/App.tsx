/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { UserProfile, MembershipTier, Booking } from "./types";
import CourtBooking from "./components/CourtBooking";
import OnlineAcademy from "./components/OnlineAcademy";
import CoachScheduler from "./components/CoachScheduler";
import MembershipCard from "./components/MembershipCard";
import PerformanceAnalytics from "./components/PerformanceAnalytics";
import CoachingFeedback from "./components/CoachingFeedback";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar,
  BookOpen,
  User,
  Star,
  Award,
  Wallet,
  Activity,
  MapPin,
  Sparkles,
  Zap,
  QrCode,
  MessageSquare,
  BarChart3,
  Sun,
  Moon,
  Laptop,
  Check,
  AlertTriangle,
  X,
  Camera,
  Play,
  TrendingUp,
  RefreshCw,
  Award as DiplomaIcon
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"booking" | "academy" | "coaches" | "account" | "analytics" | "feedback">("booking");

  const [themeMode, setThemeMode] = useState<"auto" | "light" | "dark">(() => {
    const saved = localStorage.getItem("prn_badminton_theme");
    return (saved as "auto" | "light" | "dark") || "auto";
  });
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Modal visibility states
  const [showQrCheckIn, setShowQrCheckIn] = useState(false);
  const [qrSubTab, setQrSubTab] = useState<"pass" | "scan">("pass");
  const [scanStatus, setScanStatus] = useState<"idle" | "scanning" | "success">("idle");
  const [scannedResult, setScannedResult] = useState("");

  // Clean Audio Beep Feedback helper
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // 880 Hz
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.12);
    } catch (e) {
      // Benign bypass for restricted iframe sandboxes
    }
  };

  // Effect to handle system preference detection and class injections
  useEffect(() => {
    const handleThemeSync = () => {
      if (themeMode === "dark") {
        setIsDarkMode(true);
        document.documentElement.classList.add("dark");
      } else if (themeMode === "light") {
        setIsDarkMode(false);
        document.documentElement.classList.remove("dark");
      } else {
        const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setIsDarkMode(sysDark);
        if (sysDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };

    handleThemeSync();
    localStorage.setItem("prn_badminton_theme", themeMode);

    if (themeMode === "auto") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = (e: MediaQueryListEvent) => {
        setIsDarkMode(e.matches);
        if (e.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      };
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, [themeMode]);

  // Global Athlete state stored reactively
  const [user, setUser] = useState<UserProfile>(() => {
    // Attempt local storage parse or provide default
    const saved = localStorage.getItem("prn_badminton_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      id: "usr-prn01",
      name: "คุณ ปรัชญา (Prachya)",
      email: "prn063101@gmail.com",
      avatar: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=150",
      tier: MembershipTier.SILVER,
      memberId: "PRN-7798-2026",
      joinedDate: "12 มิ.ย. 2569",
      completedQuizzes: [],
      balance: 1500, // Prefunded for easy booking testing
    };
  });

  // Keep track of active court & coach bookings
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem("prn_badminton_bookings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [];
  });

  // State sync wrapper
  const handleUserChange = (updated: UserProfile) => {
    setUser(updated);
    localStorage.setItem("prn_badminton_user", JSON.stringify(updated));
  };

  const handleAddBooking = (newB: Booking) => {
    const updated = [...bookings, newB];
    setBookings(updated);
    localStorage.setItem("prn_badminton_bookings", JSON.stringify(updated));
  };

  const handleRemoveBooking = (bkId: string) => {
    const cancelledBooking = bookings.find((b) => b.id === bkId);
    if (cancelledBooking) {
      try {
        const savedHistory = localStorage.getItem("prn_badminton_cancelled_history");
        const cancelledList = savedHistory ? JSON.parse(savedHistory) : [];
        cancelledList.push({
          id: `cancelled-${bkId}-${Date.now()}`,
          courtName: cancelledBooking.courtName,
          timeSlot: cancelledBooking.timeSlot,
          bookingType: cancelledBooking.bookingType,
          date: cancelledBooking.date,
          cost: cancelledBooking.bookingType === "Guided Coaching" ? 405 : 300,
          status: "Cancelled"
        });
        localStorage.setItem("prn_badminton_cancelled_history", JSON.stringify(cancelledList));
      } catch (e) {
        console.error("Failed to save cancelled booking history log", e);
      }
    }

    const updated = bookings.filter((b) => b.id !== bkId);
    setBookings(updated);
    localStorage.setItem("prn_badminton_bookings", JSON.stringify(updated));
  };

  // Quick stats computed
  const userBookings = bookings.filter((b) => b.userId === user.id);
  // XP: sum points from completed quizzes (100 per module) + bookings (50 each)
  const QUIZ_XP_PER_MODULE = 100;
  const xpPoints = user.completedQuizzes.filter((id) => id.startsWith("mod-")).length * QUIZ_XP_PER_MODULE + userBookings.length * 50;

  return (
    <div id="prn-badminton-app" className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans flex flex-col justify-between transition-colors duration-300">
      {/* 1. MASTER UPPER HERO BRAND HEADER (Indigo-900 & Lime-400 accented) */}
      <header className="bg-indigo-900 text-white shadow-lg relative overflow-hidden shrink-0 border-b border-lime-400/20">
        {/* Decorative court lining overlays */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-white/5 pointer-events-none border-t border-dashed border-white/10" />
        <div className="absolute top-0 right-1/4 w-0.5 h-full bg-white/5 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {/* BRAND LOGO with Lime accents */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-lime-400 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-xl font-display font-extrabold text-indigo-950 italic">PRN</span>
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-widest text-lime-400 font-display block uppercase">
                  COMPLETE BADMINTON HUB
                </span>
                <h1 className="text-xl font-display font-bold tracking-tight text-white flex items-center gap-2">
                  PRN Badminton <span className="text-lime-300">Arena & Academy</span>
                </h1>
              </div>
            </div>

            {/* QUICK STATS PILLS GRID with Lime and Indigo highlights */}
            <div className="flex flex-wrap items-center gap-3 bg-indigo-950/40 backdrop-blur-md p-2 rounded-2xl border border-white/10">
              {/* QR Check-in scanner button */}
              <button
                id="header-qr-scanner-trigger"
                onClick={() => setShowQrCheckIn(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-950 hover:bg-black/40 text-lime-400 hover:text-lime-300 rounded-xl cursor-pointer transition-all border border-lime-400/30 text-xs font-bold"
                title="คลิกสแกน QR Code เพื่อเช็คอินเข้าสนามคอร์ทแบดของคุณ"
              >
                <QrCode className="w-4 h-4 animate-pulse text-lime-400" />
                <span>QR เช็คอิน</span>
              </button>

              {/* Auto-Dark mode control switch */}
              <button
                id="header-theme-toggle"
                onClick={() => {
                  setThemeMode((prev) => {
                    if (prev === "auto") return "dark";
                    if (prev === "dark") return "light";
                    return "auto";
                  });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 text-lime-250 rounded-xl cursor-pointer text-xs font-semibold font-mono transition-all border border-transparent hover:border-white/10"
                title="คลิกเพื่อเปลี่ยนโหมดพลังงาน (อัตโนมัติ / มืด / สว่าง)"
              >
                {themeMode === "auto" ? (
                  <>
                    <Laptop className="w-3.5 h-3.5 text-lime-400" />
                    <span>Auto ({isDarkMode ? "🌙" : "☀️"})</span>
                  </>
                ) : themeMode === "dark" ? (
                  <>
                    <Moon className="w-3.5 h-3.5 fill-lime-300 text-lime-350" />
                    <span>Dark 🌙</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-350 fill-amber-350" />
                    <span>Light ☀️</span>
                  </>
                )}
              </button>

              {/* Member Card pill */}
              <div
                onClick={() => setActiveTab("account")}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-xl cursor-pointer transition-all border border-transparent hover:border-white/10 text-xs font-semibold"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
                <span>{user.tier}</span>
              </div>

              {/* Court Bookings stats indicator */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/25 rounded-xl text-xs font-mono">
                <Calendar className="w-4 h-4 text-lime-400" />
                <span>จองสนาม: <strong className="text-lime-350">{userBookings.length}</strong></span>
              </div>

              {/* EXP Points and certification badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-xl text-xs font-semibold text-lime-200">
                <Award className="w-4 h-4 text-lime-400" />
                <span>{xpPoints} EXP</span>
              </div>

              {/* Wallet credits balance */}
              <div
                onClick={() => setActiveTab("account")}
                className="flex items-center gap-2 px-3 py-1.5 bg-lime-400 text-indigo-950 hover:bg-lime-500 rounded-xl cursor-pointer text-xs font-bold font-mono transition-colors"
              >
                <Wallet className="w-4 h-4" />
                <span>฿{user.balance.toLocaleString("th-TH")}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. TAB CONTROLS NAVIGATION BAR */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 overflow-x-auto py-3 no-scrollbar scroll-smooth">
            {/* Booking Court Tab */}
            <button
              id="tab-btn-booking"
              onClick={() => setActiveTab("booking")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === "booking"
                  ? "bg-indigo-900 dark:bg-indigo-950 text-white shadow-md shadow-indigo-900/10"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-indigo-905 dark:hover:text-lime-300"
              }`}
            >
              <Calendar className="w-4 h-4" />
              จองสนามแบดมินตัน & คิวสด IoT
            </button>

            {/* Online Academy Learning Tab */}
            <button
              id="tab-btn-academy"
              onClick={() => setActiveTab("academy")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === "academy"
                  ? "bg-indigo-900 dark:bg-indigo-950 text-white shadow-md shadow-indigo-900/10"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-indigo-905 dark:hover:text-lime-300"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              คอร์สเรียนออนไลน์ & ออกเกียรติบัตร
            </button>

            {/* Coaches Scheduler Tab */}
            <button
              id="tab-btn-coaches"
              onClick={() => setActiveTab("coaches")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === "coaches"
                  ? "bg-indigo-900 dark:bg-indigo-950 text-white shadow-md shadow-indigo-900/10"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-indigo-905 dark:hover:text-lime-300"
              }`}
            >
              <Activity className="w-4 h-4" />
              จองตารางคุมฝึกโค้ชชิ่ง
            </button>

            {/* Membership Details & Account Wallet */}
            <button
              id="tab-btn-account"
              onClick={() => setActiveTab("account")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === "account"
                  ? "bg-indigo-900 dark:bg-indigo-950 text-white shadow-md shadow-indigo-900/10"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-indigo-905 dark:hover:text-lime-300"
              }`}
            >
              <User className="w-4 h-4" />
              บัตรสมาชิก & บัญชีสเตตัส
            </button>

            {/* Performance Analytics Tab */}
            <button
              id="tab-btn-analytics"
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === "analytics"
                  ? "bg-indigo-900 dark:bg-indigo-950 text-white shadow-md shadow-indigo-900/10"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-indigo-905 dark:hover:text-lime-300"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              ผลวิเคราะห์ & ประเมินฝึกซ้อม
            </button>

            {/* Coaching Feedback Form Tab */}
            <button
              id="tab-btn-feedback"
              onClick={() => setActiveTab("feedback")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === "feedback"
                  ? "bg-indigo-900 dark:bg-indigo-950 text-white shadow-md shadow-indigo-900/10"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-indigo-905 dark:hover:text-lime-300"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              ฟอร์มเสนอแนะโค้ชชิ่ง
            </button>
          </div>
        </div>
      </div>

      {/* 3. CORE SUB-DASHBOARD VIEWS CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "booking" && (
            <CourtBooking
              user={user}
              onChangeUser={handleUserChange}
              bookings={bookings}
              onAddBooking={handleAddBooking}
              onRemoveBooking={handleRemoveBooking}
            />
          )}

          {activeTab === "academy" && (
            <OnlineAcademy user={user} onChangeUser={handleUserChange} />
          )}

          {activeTab === "coaches" && (
            <CoachScheduler
              user={user}
              onChangeUser={handleUserChange}
              bookings={bookings}
              onAddBooking={handleAddBooking}
            />
          )}

          {activeTab === "account" && (
            <MembershipCard
              user={user}
              onChangeUser={handleUserChange}
              activeBookingsCount={userBookings.length}
              bookings={bookings}
            />
          )}

          {activeTab === "analytics" && (
            <PerformanceAnalytics user={user} />
          )}

          {activeTab === "feedback" && (
            <CoachingFeedback user={user} onChangeUser={handleUserChange} />
          )}
        </motion.div>
      </main>

      {/* 4. FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-500 py-8 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <p className="font-semibold text-slate-400">
            PRN Badminton Arena Ltd. • แพลตฟอร์มผู้ถือให้บริการระบบคิวและสโมสรกีฬามืออาชีพ
          </p>
          <div className="flex justify-center gap-6 text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" /> แดนสโมสรกรุงเทพฯ ฝั่งธนบุรี
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> IoT Gateway v4.2 Enabled
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 animate-pulse">
              <Zap className="w-3.5 h-3.5 text-emerald-400" /> Live Score syncing active
            </span>
          </div>
          <p className="pt-2 text-slate-600">
            © 2026 PRN Badminton Center. Developed dynamically as a complete service web-prototype. All rights reserved.
          </p>
        </div>
      </footer>

      {/* 5. INTERACTIVE HIGH-TECH QR CHECK-IN SCANNERS MODAL */}
      <AnimatePresence>
        {showQrCheckIn && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md overflow-hidden flex flex-col text-slate-800 dark:text-slate-100"
            >
              {/* Modal Banner Header */}
              <div className="bg-indigo-900 text-white p-5 relative overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-white/5 pointer-events-none border-b border-dashed border-white/10" />
                <div className="flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-lime-400" />
                    <h3 className="font-display font-bold text-sm tracking-wide">
                      ระบบเช็คอิน QR อัจฉริยะ IoT
                    </h3>
                  </div>
                  <button
                    id="close-qr-modal-btn"
                    onClick={() => {
                      setShowQrCheckIn(false);
                      setScanStatus("idle");
                      setScannedResult("");
                    }}
                    className="p-1 rounded-full bg-black/25 hover:bg-black/40 text-white cursor-pointer transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sub-tabs switch selector */}
              <div className="flex bg-slate-50 dark:bg-slate-950 p-1 border-b border-slate-200 dark:border-slate-800">
                <button
                  id="qr-modal-subtab-pass"
                  onClick={() => {
                    setQrSubTab("pass");
                    setScanStatus("idle");
                  }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    qrSubTab === "pass"
                      ? "bg-white dark:bg-slate-900 text-indigo-955 dark:text-lime-400 shadow-sm border border-slate-200 dark:border-slate-800"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  <Award className="w-4 h-4" />
                  บัตรผ่านคิวของฉัน (My Pass)
                </button>
                <button
                  id="qr-modal-subtab-scan"
                  onClick={() => {
                    setQrSubTab("scan");
                    setScanStatus("idle");
                  }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    qrSubTab === "scan"
                      ? "bg-white dark:bg-slate-900 text-indigo-955 dark:text-lime-400 shadow-sm border border-slate-200 dark:border-slate-800"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  กล้องตู้อ่านสโมสร (IoT Scan)
                </button>
              </div>

              {/* Modal Core Contents */}
              <div className="p-6 flex-grow overflow-y-auto bg-white dark:bg-slate-900">
                {qrSubTab === "pass" ? (
                  /* Option A: My Pass QR Generator */
                  <div className="flex flex-col items-center text-center">
                    <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950 px-2.5 py-0.5 rounded font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-2">
                      Athletes Gate Pass
                    </span>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">
                      {user.name}
                    </h4>
                    <p className="text-[11px] font-mono text-slate-400 mb-5">
                      {user.memberId} • เทียร์ {user.tier}
                    </p>

                    {/* QR Code Container Mockup with animated sweeps */}
                    <div className="w-44 h-44 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850 p-4.5 flex flex-col items-center justify-center relative overflow-hidden mb-5">
                      {/* Interactive laser scanner loop */}
                      <div className="absolute top-0 inset-x-0 h-0.5 bg-emerald-500 animate-bounce opacity-80" />
                      
                      {/* Virtual vector QR blocks */}
                      <svg viewBox="0 0 100 100" className="w-full h-full text-slate-800 dark:text-white" fill="currentColor">
                        <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z" />
                        <path d="M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z" />
                        <path d="M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" />
                        <path d="M40,0 h10 v10 h-10 z M55,15 h10 v15 h-10 z M40,25 h15 v5 h-15 z" />
                        <path d="M80,40 h20 v10 h-20 z M90,55 h10 v20 h-10 z" />
                        <path d="M40,40 h15 v15 h-15 z M45,60 h10 v10 h-10 z M40,80 h10 v10 h-10 z" />
                        <path d="M60,60 h20 v10 h-20 z M55,80 h15 v15 h-15 z" />
                        <rect x="45" y="45" width="10" height="10" className="text-lime-400" />
                      </svg>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-150 dark:border-slate-850/60 text-[11px] text-slate-400 w-full mb-6">
                      <span className="flex items-center justify-center gap-1.5 animate-pulse text-emerald-500 font-bold mb-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        สถานะคิวสัญญาน: สแตนบายพร้อมแสกน
                      </span>
                      ยื่นหน้ารหัสนี้เข้ากับตู้เครื่องอ่านหน้าประตูคอร์ทสโมสร เพื่อให้ประตูสวิงคลับเฮ้าส์บันทึกตารางการมาและปลดขี่สนามของท่าน
                    </div>

                    {/* Simulation trigger */}
                    {scanStatus === "success" ? (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-400 w-full text-xs font-semibold flex items-center justify-center gap-1"
                      >
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>แสกนสำเร็จ! บันทึกคิวเข้าใช้สโมสร +10 EXP</span>
                      </motion.div>
                    ) : (
                      <button
                        id="simulate-qr-pass-scan-btn"
                        onClick={() => {
                          playBeep();
                          setScanStatus("success");
                          // Award XP
                          const updatedUser = {
                            ...user,
                            completedQuizzes: [...user.completedQuizzes, `scan-pass-${Date.now()}`]
                          };
                          handleUserChange(updatedUser);
                        }}
                        className="w-full bg-lime-400 hover:bg-lime-500 text-indigo-955 font-bold py-2.5 rounded-xl text-xs transition-transform active:scale-95 cursor-pointer"
                      >
                        🔔 จำลองการเอาตู้อ่านแสกนคิวหน้าคอร์ท (Beep Test)
                      </button>
                    )}
                  </div>
                ) : (
                  /* Option B: Scan Court QR view */
                  <div className="flex flex-col items-center">
                    {scanStatus === "idle" && (
                      <>
                        <p className="text-xs text-slate-400 text-center mb-4 leading-normal">
                          คุณเล่นคอร์ทเสร็จแล้วหรือต้องการเริ่มคิวสดข้างสนาม? สแกนสเปกตราสติกเกอร์ที่เสาเน็ตคอร์ทด้วยกล้องสโมสรของคุณเพื่อบันทึกประวัติทันที!
                        </p>

                        {/* Simulated Viewfinder camera box */}
                        <div className="w-full aspect-video bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center mb-5 text-white">
                          <div className="absolute top-2 left-2 text-[9px] font-mono text-emerald-500 bg-black/40 px-1.5 py-0.5 rounded">
                            REC 1080P
                          </div>
                          
                          {/* Pulsing Viewfinder bounding brackets */}
                          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-lime-400" />
                          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-lime-400" />
                          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-lime-400" />
                          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-lime-400" />

                          {/* Dynamic slider scan bar */}
                          <div className="absolute inset-x-0 top-1/2 h-0.5 bg-lime-400/80 animate-pulse" />

                          <div className="text-center p-4">
                            <Camera className="w-7 h-7 text-slate-500 mx-auto mb-2 animate-bounce" />
                            <span className="text-[10px] text-slate-500 font-bold block">
                              รอเชื่อมต่อเลนส์กล้อง IoT...
                            </span>
                          </div>
                        </div>

                        {/* Trigger tags */}
                        <div className="space-y-2.5 w-full">
                          <span className="block text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                            คลิกเลือกพิกัดเพื่อจำลองการเล็งแสกน
                          </span>
                          
                          <button
                            id="simulate-scan-court-1-btn"
                            onClick={() => {
                              setScanStatus("scanning");
                              setTimeout(() => {
                                playBeep();
                                setScanStatus("success");
                                setScannedResult("เช็คอินสำเร็จที่สนามคอร์ทที่ 1 เรียบร้อยแล้ว! ข้อมูลคิวของท่านได้รับรายงานสู่ IoT Dashboard คลับหลัก เรียบร้อย");
                                // Reward XP
                                const updatedUser = {
                                  ...user,
                                  completedQuizzes: [...user.completedQuizzes, `scan-court-1-${Date.now()}`]
                                };
                                handleUserChange(updatedUser);
                              }, 1200);
                            }}
                            className="w-full bg-slate-100 dark:bg-slate-950 hover:bg-indigo-900 hover:text-white text-slate-700 dark:text-slate-300 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 transition-colors text-left px-4 cursor-pointer"
                          >
                            📷 เล็งแสกนแถบคิวที่เสาเน็ตสนาม [Court ID: #001]
                          </button>
                          
                          <button
                            id="simulate-scan-court-2-btn"
                            onClick={() => {
                              setScanStatus("scanning");
                              setTimeout(() => {
                                playBeep();
                                setScanStatus("success");
                                setScannedResult("เช็คอินสำเร็จที่สนามคอร์ทที่ 2 เรียบร้อยแล้ว! ข้อมูลคิวของท่านได้รับรายงานสู่ IoT Dashboard คลับหลัก เรียบร้อย");
                                // Reward XP
                                const updatedUser = {
                                  ...user,
                                  completedQuizzes: [...user.completedQuizzes, `scan-court-2-${Date.now()}`]
                                };
                                handleUserChange(updatedUser);
                              }, 1200);
                            }}
                            className="w-full bg-slate-100 dark:bg-slate-950 hover:bg-indigo-900 hover:text-white text-slate-700 dark:text-slate-300 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 transition-colors text-left px-4 cursor-pointer"
                          >
                            📷 เล็งแสกนแถบคิวที่เสาเน็ตสนาม [Court ID: #002]
                          </button>
                        </div>
                      </>
                    )}

                    {scanStatus === "scanning" && (
                      <div className="py-12 text-center">
                        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-3" />
                        <h5 className="text-xs font-bold text-slate-700 dark:text-slate-200">
                          กำลังสแกนถอดรหัสบาร์โค้ด...
                        </h5>
                        <p className="text-[10px] text-slate-400 mt-1">
                          IoT Gateway กำลังสื่อสารและประดิษฐ์สัญญานเช็คอินแบบไร้สาย
                        </p>
                      </div>
                    )}

                    {scanStatus === "success" && (
                      <div className="py-6 text-center">
                        <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-300 dark:border-emerald-800">
                          <Check className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h5 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                          แสกนและถอดข้อมูลสำเร็จ!
                        </h5>
                        <p className="text-xs text-slate-500 dark:text-slate-400 px-4 mt-2 leading-relaxed">
                          {scannedResult}
                        </p>
                        <span className="inline-block mt-4 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded">
                          🎁 รางวัลเช็คอินสำเร็จ +10 EXP
                        </span>

                        <button
                          id="reset-court-scanner-btn"
                          onClick={() => {
                            setScanStatus("idle");
                            setScannedResult("");
                          }}
                          className="mt-6 text-xs text-indigo-900 dark:text-lime-400 font-bold hover:underline cursor-pointer"
                        >
                          ทำการแสกนจุดอื่นใหม่อีกครั้ง
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

