/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { UserProfile, MembershipTier, Booking } from "../types";
import { motion } from "motion/react";
import {
  User,
  Wallet,
  Award,
  Clock,
  Star,
  ShieldCheck,
  RefreshCw,
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  History,
  Trash2,
} from "lucide-react";

interface MembershipCardProps {
  user: UserProfile;
  onChangeUser: (updated: UserProfile) => void;
  activeBookingsCount: number;
  bookings: Booking[];
}

export default function MembershipCard({ user, onChangeUser, activeBookingsCount, bookings }: MembershipCardProps) {
  const [topUpAmount, setTopUpAmount] = useState<string>("500");
  const [isRotating, setIsRotating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Search & Filter state for Booking History
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All"); // All, Upcoming, Completed, Cancelled
  const [typeFilter, setTypeFilter] = useState<string>("All"); // All, Court, Coaching

  // Dynamic cancel log trigger to refresh local state if items change
  const [reloadCancellationToggle, setReloadCancellationToggle] = useState<boolean>(false);

  const handleClearHistoryLog = () => {
    if (window.confirm("คุณต้องการล้างประวัติการทำรายการยกเลิก (Simulated Cancelled Logs) ใช่หรือไม่?")) {
      localStorage.removeItem("prn_badminton_cancelled_history");
      setReloadCancellationToggle((prev) => !prev);
    }
  };

  // Memoized lists parsing
  const cancelledBookings = useMemo(() => {
    try {
      const saved = localStorage.getItem("prn_badminton_cancelled_history");
      // reloadCancellationToggle triggers direct recalculation
      const dummy = reloadCancellationToggle;
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }, [bookings, reloadCancellationToggle]);

  const displayBookings = useMemo(() => {
    // 1. Current active/upcoming bookings made by the current athlete
    const activeItems = bookings
      .filter((b) => b.userId === user.id)
      .map((b) => ({
        id: b.id,
        courtName: b.courtName,
        timeSlot: b.timeSlot,
        bookingType: b.bookingType,
        date: b.date,
        cost: b.bookingType === "Guided Coaching" ? 337.5 : 300, // estimate based on tiered discount (SILVER is 10%)
        status: "Upcoming" as const,
      }));

    // 2. Preseeded realistic history items from May-June 2026
    const preseededItems = [
      {
        id: "hist-1",
        courtName: "สนาม A - Premium Rubber (Court 1)",
        timeSlot: "15:00 - 16:00",
        bookingType: "Practice Session" as const,
        date: "2026-06-10",
        cost: 300,
        status: "Completed" as const,
      },
      {
        id: "hist-2",
        courtName: "Coaching with Coach Ice (Pro Training)",
        timeSlot: "10:00 - 11:00",
        bookingType: "Guided Coaching" as const,
        date: "2026-06-08",
        cost: 405,
        status: "Completed" as const,
      },
      {
        id: "hist-3",
        courtName: "สนาม B - Olympic Wooden (Court 2)",
        timeSlot: "19:00 - 20:00",
        bookingType: "Match Matchplay" as const,
        date: "2026-06-05",
        cost: 350,
        status: "Completed" as const,
      },
      {
        id: "hist-4",
        courtName: "Coaching with Coach Bas (Pro Training)",
        timeSlot: "13:00 - 14:00",
        bookingType: "Guided Coaching" as const,
        date: "2026-05-28",
        cost: 0,
        status: "Cancelled" as const,
      },
    ];

    // Combine current upcoming + local cancelled logs + preseeded historical logs
    const all = [...activeItems, ...cancelledBookings, ...preseededItems];

    // Sort descending by date
    return all.sort((a, b) => b.date.localeCompare(a.date));
  }, [bookings, cancelledBookings, user.id]);

  // Filtering implementation
  const filteredBookings = useMemo(() => {
    return displayBookings.filter((b) => {
      // Status filter
      if (statusFilter !== "All" && b.status !== statusFilter) return false;

      // Type filter
      if (typeFilter !== "All") {
        if (typeFilter === "Coaching" && b.bookingType !== "Guided Coaching") return false;
        if (typeFilter === "Court" && b.bookingType === "Guided Coaching") return false;
      }

      // Text search query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesName = b.courtName.toLowerCase().includes(q);
        const matchesType = b.bookingType.toLowerCase().includes(q);
        if (!matchesName && !matchesType) return false;
      }

      return true;
    });
  }, [displayBookings, statusFilter, typeFilter, searchQuery]);

  const tiers = [
    {
      name: MembershipTier.GUEST,
      color: "from-slate-400 to-slate-600",
      accent: "text-slate-400",
      perks: ["จองสนามล่วงหน้า 1 วัน", "เข้าชมวิดีโอหลักสูตรเบื้องต้น"],
    },
    {
      name: MembershipTier.SILVER,
      color: "from-sky-500 to-indigo-700",
      accent: "text-sky-300",
      perks: ["ส่วนลดค่าสนาม 10%", "จองสนามล่วงหน้า 7 วัน", "เข้าเรียนหลักสูตรระดับกลางฟรี"],
    },
    {
      name: MembershipTier.GOLD,
      color: "from-amber-400 via-emerald-600 to-slate-900",
      accent: "text-amber-300",
      perks: ["ส่วนลดค่าสนาม 25%", "จองสนามล่วงหน้า 14 วัน", "โค้ชชิ่งฟรี 2 ชั่วโมง/เดือน", "ปลดล็อกบทเรียนระดับโปร"],
    },
  ];

  const handleTierChange = (newTier: MembershipTier) => {
    onChangeUser({ ...user, tier: newTier });
  };

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(topUpAmount);
    if (!isNaN(amount) && amount > 0) {
      onChangeUser({ ...user, balance: user.balance + amount });
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    }
  };

  const currentTierInfo = tiers.find((t) => t.name === user.tier) || tiers[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* LEFT: Digital Membership Card (Aesthetic Core) */}
      <div className="lg:col-span-12 xl:col-span-5 flex flex-col items-center">
        <h3 className="text-xl font-display font-bold text-gray-800 mb-4 flex items-center gap-2 self-start">
          <Award className="text-indigo-900 w-5 h-5" />
          บัตรสมาชิกดิจิทัล (Digital Access Pass)
        </h3>

        {/* FLIPPABLE & SHINING MEMBERSHIP CARD */}
        <motion.div
          id="digital-member-card"
          className={`relative w-full max-w-sm h-64 rounded-2xl bg-gradient-to-br ${currentTierInfo.color} p-6 text-white shadow-xl overflow-hidden cursor-pointer`}
          whileHover={{ scale: 1.03, y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{ transformStyle: "preserve-3d" }}
          onClick={() => setIsRotating(!isRotating)}
        >
          {/* Neon Spotlight Overlay Effect */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />
          
          {/* Subtle Court Line Texture */}
          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-white/10 pointer-events-none" />
          <div className="absolute left-1/2 inset-y-0 w-[1px] bg-white/10 pointer-events-none" />
          
          <div className="relative h-full flex flex-col justify-between">
            {/* Header: Logo and Tier badge */}
            <div className="flex justify-between items-start">
              <div>
                <span className="font-display font-bold text-lg tracking-wider text-white flex items-center gap-1.5">
                  PRN BADMINTON
                </span>
                <p className="text-[10px] text-white/50 tracking-widest font-mono">COURT & CLUB ACADEMY</p>
              </div>
              <div className="bg-white/15 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs font-semibold tracking-wide">
                👑 {user.tier.split(" ")[0]}
              </div>
            </div>

            {/* Middle: Card chip and QR mockup */}
            <div className="flex justify-between items-center my-2">
              {/* Golden metallic chip */}
              <div className="w-11 h-8 rounded-md bg-gradient-to-r from-amber-200 to-amber-400 opacity-80 border border-amber-300 flex flex-col gap-1 p-1">
                <div className="w-full h-[1px] bg-amber-600/30" />
                <div className="flex justify-between flex-grow">
                  <div className="w-2 h-full bg-amber-600/20" />
                  <div className="w-2 h-full bg-amber-600/20" />
                </div>
              </div>
              
              {/* Dynamic QR Check-in badge */}
              <div className="bg-white p-1 rounded-md">
                <div className="w-8 h-8 bg-slate-900 flex items-center justify-center text-[5px] text-white font-mono leading-none tracking-widest overflow-hidden">
                  PRN_MEMBER
                </div>
              </div>
            </div>

            {/* Bottom: User ID and details */}
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] text-white/60 font-mono uppercase tracking-widest">MEMBER NAME</p>
                <div className="text-sm font-semibold truncate max-w-[180px]">{user.name}</div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/60 font-mono tracking-widest">ID NUMBER</p>
                <div className="text-xs font-mono font-bold tracking-widest text-amber-200">{user.memberId}</div>
              </div>
            </div>
          </div>
        </motion.div>

        <p className="text-xs text-slate-400 mt-3 font-mono text-center">
          💡 คลิกบนบัตรเพื่อสลับข้อมูล หรือเชื่อมต่อเข้าสแกนประตูสนามอัจฉริยะ (IoT Smart Court Gateway)
        </p>

        {/* Quick Tier Switching Panel */}
        <div className="w-full mt-6 bg-slate-50 border border-slate-200 rounded-xl p-4">
          <h4 className="text-sm font-bold text-slate-800 mb-3">ปรับระดับสมาชิกเพื่อรับสิทธิเพิ่ม:</h4>
          <div className="flex flex-col gap-2">
            {tiers.map((t) => (
              <button
                key={t.name}
                id={`tier-select-${t.name.split(" ")[0].toLowerCase()}`}
                onClick={() => handleTierChange(t.name)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left text-xs transition-all ${
                  user.tier === t.name
                    ? "bg-indigo-50 border-indigo-500 text-indigo-900 font-bold"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${t.color}`} />
                  <span>{t.name}</span>
                </div>
                {user.tier === t.name && (
                  <span className="text-[10px] font-bold bg-lime-450 text-indigo-950 px-2 py-0.5 rounded-full uppercase">
                    ACTIVE
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: User Profile Settings & Wallet Recharge */}
      <div className="lg:col-span-12 xl:col-span-7 flex flex-col gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-display font-bold text-gray-800 mb-4 flex items-center gap-2">
            <User className="text-indigo-900 w-5 h-5" />
            ข้อมูลบัญชีนักกีฬา (Athlete Profile)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                ชื่อ-นามสกุล
              </label>
              <input
                id="input-profile-name"
                type="text"
                value={user.name}
                onChange={(e) => onChangeUser({ ...user, name: e.target.value })}
                className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                อีเมลติดต่อ
              </label>
              <input
                id="input-profile-email"
                type="email"
                value={user.email}
                onChange={(e) => onChangeUser({ ...user, email: e.target.value })}
                className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg text-xs text-slate-600 mt-2">
            <ShieldCheck className="text-indigo-900 flex-shrink-0 w-5 h-5" />
            <div>
              <span className="font-bold text-indigo-900">สิทธิ์พริวิลเลจปัจจุบัน: </span>
              {currentTierInfo.perks.join(" • ")}
            </div>
          </div>
        </div>

        {/* Virtual Wallet Module (Satisfying persistent credits for booking mockup) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-display font-bold text-gray-800 flex items-center gap-2">
              <Wallet className="text-indigo-900 w-5 h-5" />
              กระเป๋าเงินระบบสมาชิก (Virtual Wallet Balance)
            </h3>
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-mono">
              เพื่อทำการจำลองจองคิวสนาม
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-slate-50 p-4 rounded-xl mb-4 border border-slate-200">
            <div className="flex-grow">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">ยอดเงินคงเหลือปัจจุบัน</p>
              <span className="text-3xl font-display font-bold text-indigo-900">
                ฿{user.balance.toLocaleString("th-TH")}.00
              </span>
            </div>
            <div className="flex-shrink-0 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4 flex flex-col gap-1">
              <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-indigo-900" />
                จองสนามรอคิวอยู่: <strong className="text-slate-800 font-mono">{activeBookingsCount} รายการ</strong>
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500" />
                แต้มสะสม: <strong className="text-slate-800 font-mono">{user.completedQuizzes.length * 100} แต้ม</strong>
              </span>
            </div>
          </div>

          <form onSubmit={handleTopUp} className="flex gap-2">
            <input
              id="input-topup-amount"
              type="number"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              placeholder="จำนวนเงินที่ต้องการเติม"
              className="w-1/2 p-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-indigo-500"
              min="10"
            />
            <button
              id="btn-topup-submit"
              type="submit"
              className="w-1/2 bg-indigo-900 hover:bg-indigo-805 text-white font-bold py-2 rounded-lg text-sm transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-sm shadow-indigo-900/10"
            >
              <RefreshCw className="w-4 h-4" />
              เติมเงินจำลอง (Top up)
            </button>
          </form>

          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-lime-800 font-bold mt-2.5 bg-lime-100/60 p-2 rounded border border-lime-300 text-center"
            >
              🎉 เติมเงินจำลองสำเร็จ! ยอดเงินอัปเดตเรียบร้อยแล้ว
            </motion.div>
          )}
        </div>
      </div>

      {/* --- BOOKING HISTORY SECTION (Highly Polished & High-Contrast) --- */}
      <div id="booking-history-container" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-display font-bold text-slate-800 flex items-center gap-2">
              <History className="text-indigo-900 w-5 h-5 animate-pulse" />
              ประวัติการทำรายการจอง & คอร์สเรียน (Booking & Training History)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              แสดงรายการชั่วโมงคุมสอบโค้ดชิ่งและการจองสนามแบดมินตันส่วนตัว ทั้งคิวปัจจุบันและย้อนหลัง
            </p>
          </div>
          {cancelledBookings.length > 0 && (
            <button
              id="btn-clear-history-log"
              onClick={handleClearHistoryLog}
              className="text-[10px] text-red-500 hover:text-red-600 hover:bg-red-50 border border-red-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer font-bold transition-all ml-auto sm:ml-0"
              title="ล้างข้อมูลการยกเลิก"
            >
              <Trash2 className="w-3.5 h-3.5" /> ล้างประวัติการยกเลิก
            </button>
          )}
        </div>

        {/* Toolbar controls: Search query, and Type and Status filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
          {/* Search box query */}
          <div className="md:col-span-5 relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              id="search-history-query"
              type="text"
              placeholder="ค้นหาตามชื่อสนามคอร์ท ชื่อครูฝึกสอน หรือเลขคีย์..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700"
            />
          </div>

          {/* Filtering Pills for Type */}
          <div className="md:col-span-4 flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> จำแนก:
            </span>
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 w-full">
              {(["All", "Court", "Coaching"] as const).map((t) => (
                <button
                  key={t}
                  id={`filter-type-${t.toLowerCase()}`}
                  onClick={() => setTypeFilter(t)}
                  className={`flex-1 text-center py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                    typeFilter === t
                      ? "bg-indigo-900 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {t === "All" ? "ทั้งหมด" : t === "Court" ? "สนามคอร์ท" : "ชั่วโมงโค้ช"}
                </button>
              ))}
            </div>
          </div>

          {/* Filtering Pills for Status */}
          <div className="md:col-span-3">
            <select
              id="filter-status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
            >
              <option value="All">ทุกสถานะบริการ (All Status)</option>
              <option value="Upcoming">🕒 รอดำเนินการ (Upcoming)</option>
              <option value="Completed">✅ สำเร็จแล้ว (Completed)</option>
              <option value="Cancelled">❌ ยกเลิกแล้ว (Cancelled)</option>
            </select>
          </div>
        </div>

        {/* History Table display or Empty state */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-500">
              ⚠️ ไม่พบประวัติการจองและบันทึกคอร์สเรียนตรงตามเงื่อนไขตัวกรอง
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              ลองพิมพ์ปรับเพื่อค้นหาชื่อสนามอื่น หรือทำรายการจองใหม่ในแดชบอร์ดด้านบนครับ
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">วันและเวลาจอง</th>
                  <th className="py-3 px-4">ชื่อคอร์ท / ผู้ฝึกสอน (Instructor)</th>
                  <th className="py-3 px-4">ประเภทคิว</th>
                  <th className="py-3 px-4">ค่าเหมาจ่าย (Simulated)</th>
                  <th className="py-3 px-4 text-center">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {filteredBookings.map((b, idx) => {
                  let statusBg = "";
                  let statusText = "";
                  let typeBadgeColor = "";

                  if (b.status === "Completed") {
                    statusBg = "bg-emerald-50 text-emerald-800 border-emerald-200";
                    statusText = "Completed / สำเร็จ";
                  } else if (b.status === "Upcoming") {
                    statusBg = "bg-indigo-50 text-indigo-900 border-indigo-200 animate-pulse";
                    statusText = "Upcoming / รอคิว";
                  } else if (b.status === "Cancelled") {
                    statusBg = "bg-red-50 text-red-600 border-red-200";
                    statusText = "Cancelled / ยกเลิก";
                  }

                  if (b.bookingType === "Guided Coaching") {
                    typeBadgeColor = "bg-amber-50 text-amber-800 border-amber-200 font-bold";
                  } else {
                    typeBadgeColor = "bg-sky-50 text-sky-800 border-sky-100 font-bold";
                  }

                  return (
                    <motion.tr
                      key={b.id}
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(idx * 0.04, 0.4) }}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      {/* Date details column */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-slate-700 text-[11px]">
                          {b.date}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {b.timeSlot}
                        </div>
                      </td>

                      {/* Course / Court details column */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                          {b.bookingType === "Guided Coaching" ? (
                            <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-sky-450 shrink-0" />
                          )}
                          {b.courtName}
                        </div>
                        <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                          REFID: {b.id.substring(0, 16)}
                        </div>
                      </td>

                      {/* Service Category/Type badge column */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-block text-[9px] px-2 py-0.5 rounded-full border ${typeBadgeColor}`}>
                          {b.bookingType === "Guided Coaching" ? "🎓 Pro Trainer Coaching" : `🏸 ${b.bookingType}`}
                        </span>
                      </td>

                      {/* Price column */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        {b.cost > 0 ? `฿${b.cost.toLocaleString("th-TH")}` : <span className="text-slate-400 italic font-medium">ฟรี / คืนยอดแล้ว</span>}
                      </td>

                      {/* Status badge column */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-md border ${statusBg}`}>
                          {statusText}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
