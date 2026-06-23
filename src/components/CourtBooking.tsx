/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { UserProfile, MembershipTier, BadmintonCourt, Booking, LiveCourtMatch } from "../types";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar,
  Clock,
  Play,
  Pause,
  Plus,
  Trash2,
  Users,
  Tv,
  CheckCircle,
  AlertTriangle,
  Flame,
  Dribbble,
} from "lucide-react";

interface CourtBookingProps {
  user: UserProfile;
  onChangeUser: (updated: UserProfile) => void;
  bookings: Booking[];
  onAddBooking: (booking: Booking) => void;
  onRemoveBooking: (id: string) => void;
}

const COURTS: BadmintonCourt[] = [
  { id: "crt-1", name: "Court A - Premium Rubber", courtType: "Premium Rubber", pricePerHour: 300, courtColor: "bg-emerald-700" },
  { id: "crt-2", name: "Court B - Olympic Timber", courtType: "Olympic Wooden", pricePerHour: 400, courtColor: "bg-teal-800" },
  { id: "crt-3", name: "Court C - Academy Zone", courtType: "Standard Turf", pricePerHour: 250, courtColor: "bg-green-700" },
];

const TIME_SLOTS = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
  "18:00 - 19:00",
  "19:00 - 20:00",
  "20:00 - 21:00",
  "21:00 - 22:00",
];

const PRE_SEEDED_BOOKINGS: Partial<Booking>[] = [
  { courtId: "crt-1", userName: "คุณมนัสพงษ์", timeSlot: "09:00 - 10:00" },
  { courtId: "crt-1", userName: "โกลด์คลับ ซ้อมคู่", timeSlot: "12:00 - 13:00" },
  { courtId: "crt-2", userName: "ทีมสโมสร PRN", timeSlot: "15:00 - 16:00" },
  { courtId: "crt-3", userName: "คอร์สเรียนขั้นพื้นฐาน", timeSlot: "10:00 - 11:00" },
  { courtId: "crt-3", userName: "โค้ชแกลบ สอนเดี่ยว", timeSlot: "11:00 - 12:00" },
];

export default function CourtBooking({
  user,
  onChangeUser,
  bookings,
  onAddBooking,
  onRemoveBooking,
}: CourtBookingProps) {
  const [selectedCourt, setSelectedCourt] = useState<BadmintonCourt>(COURTS[0]);
  const [bookingType, setBookingType] = useState<"Practice Session" | "Match Matchplay" | "Guided Coaching">("Practice Session");
  const [activeDate, setActiveDate] = useState<string>("2026-06-12");
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Live real-time simulator state
  const [isSimulating, setIsSimulating] = useState(true);
  const [liveMatches, setLiveMatches] = useState<LiveCourtMatch[]>([
    {
      courtId: "crt-1",
      courtName: "Court A",
      player1: "กิตติภพ (Gold)",
      player2: "ณัฐวุฒิ (Silver)",
      score1: 15,
      score2: 12,
      setNumber: 1,
      status: "In Progress",
    },
    {
      courtId: "crt-2",
      courtName: "Court B",
      player1: "ทีมสโมสร A",
      player2: "ทีมสโมสร B",
      score1: 19,
      score2: 20,
      setNumber: 2,
      status: "Match Point",
    },
    {
      courtId: "crt-3",
      courtName: "Court C",
      player1: "น้องแป้ง (Guest)",
      player2: "โค้ชไอซ์",
      score1: 8,
      score2: 11,
      setNumber: 1,
      status: "Interval",
    },
  ]);

  const [queueList, setQueueList] = useState<string[]>([
    "คิวที่ #04 - คุณบอมบ์ (Silver) รอต่อสนาม A",
    "คิวที่ #05 - คุณนพดล (Gold) รอต่อสนาม B",
    "คิวที่ #06 - ทีมซ้อมสมทบ (Guest) รอต่อสนาม C",
  ]);

  // Real-time scores and queues simulation engine
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setLiveMatches((prev) =>
        prev.map((match) => {
          // Semi-random points increment
          const pointToP1 = Math.random() > 0.5;
          let newS1 = match.score1;
          let newS2 = match.score2;
          let status = match.status;

          if (pointToP1) {
            newS1 += 1;
          } else {
            newS2 += 1;
          }

          // Check for set termination or match outcome at 21
          if (newS1 >= 21 || newS2 >= 21) {
            // Pick a completed alert
            const winner = newS1 >= 21 ? match.player1 : match.player2;
            
            // Notify UI or simulator rotation
            setTimeout(() => {
              setFeedback({
                message: `📢 [IoT Live] การแข่งขันที่ ${match.courtName} สิ้นสุดแล้ว! ฝ่ายที่ชนะ: ${winner}`,
                type: "success",
              });
              // Cycle queue: replace oldest player with a waiting group
              const queueNext = queueList[0] || "คุณสมาชิกลำดับถัดไป";
              setQueueList((q) => [...q.slice(1), `คิวสุ่มใหม่ - ${match.player1} แกลเลอรีแก้มือ`]);
              
              // Restart score card with fresh players from queue
              setLiveMatches((current) =>
                current.map((m) =>
                  m.courtId === match.courtId
                    ? {
                        ...m,
                        player1: queueNext.split(" - ")[1]?.split(" รอ")[0] || "นักกีฬาใหม่",
                        player2: "โกลด์สปริงเกอร์",
                        score1: 0,
                        score2: 0,
                        setNumber: m.setNumber < 3 ? m.setNumber + 1 : 1,
                        status: "Warmup" as any,
                      }
                    : m
                )
              );
            }, 300);

            return {
              ...match,
              score1: 21,
              score2: 20,
              status: "Match Point",
            };
          }

          // Assign correct state label based on scores value
          if (newS1 >= 20 || newS2 >= 20) {
            status = "Match Point";
          } else if (newS1 === 11 || newS2 === 11) {
            status = "Interval";
          } else {
            status = "In Progress";
          }

          return {
            ...match,
            score1: newS1,
            score2: newS2,
            status,
          };
        })
      );
    }, 4500);

    return () => clearInterval(interval);
  }, [isSimulating, queueList]);

  // Clean feedback after 3 seconds
  useEffect(() => {
    if (feedback) {
      const t = setTimeout(() => setFeedback(null), 4000);
      return () => clearTimeout(t);
    }
  }, [feedback]);

  // Calculate dynamic membership tier discounts
  const getTaxAndDiscounts = (basePrice: number) => {
    let discountPercent = 0;
    if (user.tier === MembershipTier.SILVER) discountPercent = 10;
    if (user.tier === MembershipTier.GOLD) discountPercent = 25;

    const discountAmount = Math.round((basePrice * discountPercent) / 100);
    const finalPrice = basePrice - discountAmount;
    return { discountPercent, discountAmount, finalPrice };
  };

  const handleBookSlot = (timeSlot: string) => {
    // 1. Check if already booked
    const isAlreadyBooked = bookings.some(
      (b) => b.courtId === selectedCourt.id && b.timeSlot === timeSlot
    );
    if (isAlreadyBooked) {
      setFeedback({ message: "❌ ช่วงเวลานี้มีการจองคิวเรียบร้อยแล้ว", type: "error" });
      return;
    }

    // 2. Compute cost
    const { finalPrice } = getTaxAndDiscounts(selectedCourt.pricePerHour);

    // 3. Check membership balance
    if (user.balance < finalPrice) {
      setFeedback({
        message: `❌ ยอดเงินจำลองของท่านไม่เพียงพอ (ต้องการ ฿${finalPrice} ของคงเหลือมี ฿${user.balance}) กรุณาเติมเงินจำลองที่แท็บบัญชีผู้ใช้`,
        type: "error",
      });
      return;
    }

    // 4. Create Booking
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      courtId: selectedCourt.id,
      courtName: selectedCourt.name,
      userId: user.id,
      userName: user.name,
      userTier: user.tier,
      timeSlot,
      bookingType,
      date: activeDate,
      createdAt: new Date().toLocaleTimeString("th-TH"),
    };

    // Deduct balance and register booking
    onChangeUser({ ...user, balance: user.balance - finalPrice });
    onAddBooking(newBooking);
    setFeedback({
      message: `🎉 จอง ${selectedCourt.name} รอบ ${timeSlot} สำเร็จ! ตัดยอดเงิน ฿${finalPrice}`,
      type: "success",
    });
  };

  const handleCancelBookingLocal = (bkId: string) => {
    const bookingToCancel = bookings.find((b) => b.id === bkId);
    if (!bookingToCancel) return;

    // Refund based on the booked court
    const courtRef = COURTS.find((c) => c.id === bookingToCancel.courtId);
    const cost = courtRef ? courtRef.pricePerHour : 0;
    const { finalPrice } = getTaxAndDiscounts(cost);

    onChangeUser({ ...user, balance: user.balance + finalPrice });
    onRemoveBooking(bkId);
    setFeedback({
      message: `⚠️ ยกเลิกการจองเสร็จสิ้น คืนยอดเงิน ฿${finalPrice} เข้ากระเป๋าของคุณเรียบร้อย`,
      type: "success",
    });
  };

  return (
    <div className="space-y-8">
      {/* feedback message banner */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-xl shadow-lg border text-sm flex items-center justify-between gap-2 max-w-2xl mx-auto ${
              feedback.type === "success"
                ? "bg-white border-lime-400 text-indigo-905"
                : "bg-red-50 border-red-200 text-red-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 flex-shrink-0 text-lime-500" />
              <span className="font-semibold">{feedback.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* LEFT: Core court selection & Dynamic timeline booking board */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h3 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="text-indigo-900 w-5 h-5" />
                  จองคิวสนามแบดมินตันอัจฉริยะ (Smart Court Scheduler)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  เลือกสนามที่เหมาะสมกับสไตล์ของคุณ และเลือกรอบเวลารันคิวได้ทันที
                </p>
              </div>

              {/* Booking type and Date selector */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  id="booking-type-select"
                  value={bookingType}
                  onChange={(e) => setBookingType(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg p-2 text-xs focus:ring-2 focus:ring-indigo-900 font-medium"
                >
                  <option value="Practice Session">🎯 ซ้อมทั่วไป (Practice)</option>
                  <option value="Match Matchplay">🔥 ท้าดวลกระชับมิตร (Matchplay)</option>
                  <option value="Guided Coaching">🏆 เรียนส่วนตัว (Guided Lesson)</option>
                </select>
                <div className="flex items-center bg-indigo-50 border border-indigo-100 text-indigo-900 font-mono text-xs px-3 py-2 rounded-lg gap-2 cursor-pointer transition-all">
                  <Clock className="w-3.5 h-3.5 text-indigo-900" />
                  <span>{activeDate}</span>
                </div>
              </div>
            </div>

            {/* Courts Quick Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {COURTS.map((court) => {
                const isSelected = selectedCourt.id === court.id;
                const { finalPrice } = getTaxAndDiscounts(court.pricePerHour);
                return (
                  <button
                    key={court.id}
                    id={`court-tab-${court.id}`}
                    onClick={() => setSelectedCourt(court)}
                    className={`text-left rounded-xl p-4 border transition-all flex flex-col justify-between h-28 relative overflow-hidden cursor-pointer ${
                      isSelected
                        ? "border-indigo-900 bg-indigo-50/50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-305 hover:bg-slate-50/40"
                    }`}
                  >
                    <div className="relative">
                      <span className="text-sm font-bold text-indigo-900 block">{court.name}</span>
                      <span className="text-[10px] text-slate-500 block font-medium mt-0.5">{court.courtType}</span>
                    </div>

                    <div className="relative mt-2">
                      <p className="text-[10px] text-slate-400 tracking-wider">ราคาชั่วโมงละ</p>
                      <span className="text-sm font-bold text-indigo-905">
                        ฿{finalPrice} 
                        <span className="text-[10px] text-slate-500 font-normal"> / ช.ม.</span>
                      </span>
                    </div>

                    {/* Small colored dot representative of standard court type */}
                    <div className={`absolute bottom-3 right-3 w-5 h-5 rounded-full ${isSelected ? 'bg-lime-400 text-indigo-900 border-lime-400' : 'bg-slate-700 text-white'} shadow-inner flex items-center justify-center text-[8px] font-bold`}>
                      ★
                    </div>
                  </button>
                );
              })}
            </div>

            {/* TIME GRID CONTAINER (Gantt-style representation) */}
            <div>
              <div className="bg-slate-100 rounded-lg p-3 text-slate-600 text-xs font-bold grid grid-cols-12 gap-2 mb-3 items-center">
                <span className="col-span-4 pl-2 uppercase tracking-wider text-[10px]">ช่วงเวลาจอง (Time Slot)</span>
                <span className="col-span-5 text-center uppercase tracking-wider text-[10px]">สถานะคิวจอง</span>
                <span className="col-span-3 text-right pr-2 uppercase tracking-wider text-[10px]">ดำเนินการ</span>
              </div>

              <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
                {TIME_SLOTS.map((slot) => {
                  // Check if booked by user
                  const userBooking = bookings.find(
                    (b) => b.courtId === selectedCourt.id && b.timeSlot === slot && b.userId === user.id
                  );
                  // Check if booked by other pre-seeded or players
                  const otherBooking = bookings.find(
                    (b) => b.courtId === selectedCourt.id && b.timeSlot === slot && b.userId !== user.id
                  );
                  const isPreseeded = PRE_SEEDED_BOOKINGS.find(
                    (pb) => pb.courtId === selectedCourt.id && pb.timeSlot === slot
                  );

                  let statusText = "ว่าง • พร้อมเข้าคิว";
                  let statusBg = "text-lime-700 bg-lime-100/60 border-lime-300 font-semibold";
                  let btnAction = (
                    <button
                      id={`btn-book-${slot.replace(":", "").replace(" ", "-")}`}
                      onClick={() => handleBookSlot(slot)}
                      className="bg-indigo-900 hover:bg-indigo-805 active:scale-95 text-white text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-all uppercase tracking-wider"
                    >
                      <Plus className="w-3.5 h-3.5 text-lime-450" />
                      จองคิวนี้
                    </button>
                  );

                  if (userBooking) {
                    statusText = "🟢 คุณจองแล้ว (" + userBooking.bookingType.split(" ")[0] + ")";
                    statusBg = "text-indigo-900 bg-indigo-100 border-indigo-200 font-bold";
                    btnAction = (
                      <button
                        id={`btn-cancel-${userBooking.id}`}
                        onClick={() => handleCancelBookingLocal(userBooking.id)}
                        className="text-red-650 hover:text-red-700 bg-red-100/55 hover:bg-red-100 p-1.5 rounded-lg border border-red-200 transition-all cursor-pointer"
                        title="ยกเลิกและรับเงินคืน"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    );
                  } else if (otherBooking) {
                    statusText = `🔴 ไม่ว่าง • คิวของคุณ ${otherBooking.userName}`;
                    statusBg = "text-slate-500 bg-slate-100/80 border-slate-200";
                    btnAction = (
                      <span className="text-xs text-slate-400 italic">ปิดรับจอง</span>
                    );
                  } else if (isPreseeded) {
                    statusText = `🔴 ติดจอง • ${isPreseeded.userName}`;
                    statusBg = "text-red-800 bg-red-50 border-red-100";
                    btnAction = (
                      <span className="text-xs text-slate-400 italic font-mono">ปิดรับจอง</span>
                    );
                  }

                  return (
                    <div
                      key={slot}
                      className="grid grid-cols-12 items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all shadow-sm"
                    >
                      {/* Time Slot column */}
                      <div className="col-span-4 flex items-center gap-2 pl-2">
                        <Clock className="w-4 h-4 text-indigo-900" />
                        <span className="text-xs font-mono font-bold text-slate-800">{slot}</span>
                      </div>

                      {/* Status indicator column */}
                      <div className="col-span-5 text-center">
                        <span className={`inline-block text-[10px] px-2.5 py-1 rounded-full border ${statusBg}`}>
                          {statusText}
                        </span>
                      </div>

                      {/* Action column */}
                      <div className="col-span-3 flex justify-end pr-2">
                        {btnAction}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: REAL-TIME IoT SCOREBOARD MONITOR & QUEUE SIMULATION */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          {/* Active Bookings Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center justify-between">
              <span>คิวจองของคุณวันนี้ ({bookings.filter((b) => b.userId === user.id).length} คิว)</span>
              <span className="text-[10px] font-bold bg-indigo-50 text-indigo-900 border border-indigo-100 rounded px-2">
                ACTIVE
              </span>
            </h4>
            
            {bookings.filter((b) => b.userId === user.id).length === 0 ? (
              <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl text-xs text-slate-400">
                ⚠️ ยังไม่มีประวัติการจองคิวในสนามของคุณในรอบนี้ ค้นหาช่วงเวลาที่ตารางด้านข้างได้เลยครับ
              </div>
            ) : (
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {bookings
                  .filter((b) => b.userId === user.id)
                  .map((b) => (
                    <div key={b.id} className="flex justify-between items-center p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                      <div>
                        <div className="font-bold text-indigo-900">{b.courtName}</div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 font-mono mt-0.5">
                          ⏰ {b.timeSlot} | {b.bookingType.split(" ")[0]}
                        </div>
                      </div>
                      <button
                        onClick={() => handleCancelBookingLocal(b.id)}
                        className="text-red-500 hover:text-red-600 bg-white hover:bg-red-50 p-1.5 rounded-md border border-slate-200 transition-all cursor-pointer font-semibold"
                        title="คืนยอดจอง"
                      >
                        ยกเลิก
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* REALTIME IoT INTERACTIVE SCOREBOARD */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden border border-slate-800">
            {/* Background glowing rings */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />

            <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10 relative">
              <div className="flex items-center gap-2">
                <Tv className="text-lime-400 w-5 h-5 animate-pulse" />
                <div>
                  <h3 className="text-sm font-display font-bold tracking-wider flex items-center gap-1.5 text-white">
                    IoT LIVE SCOREBOARD
                    <span className="live-indicator inline-block w-2.5 h-2.5 rounded-full bg-red-500" />
                  </h3>
                  <p className="text-[9px] text-white/40 tracking-wider">กระดานคะแนนเรียลไทม์จำลองสนามและคิว</p>
                </div>
              </div>

              {/* Simulation Switch */}
              <button
                id="btn-toggle-simulation"
                onClick={() => setIsSimulating(!isSimulating)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-all flex items-center gap-1 ${
                  isSimulating
                    ? "bg-lime-400/20 text-lime-400 border border-lime-400/30"
                    : "bg-slate-800 text-slate-400 border border-slate-705"
                }`}
              >
                {isSimulating ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
                {isSimulating ? "จำลองอยู่" : "หยุดจำลอง"}
              </button>
            </div>

            {/* Real-time Match Items */}
            <div className="space-y-4 relative">
              {liveMatches.map((m) => {
                const isMatchPoint = m.status === "Match Point";
                return (
                  <div
                    key={m.courtId}
                    className="bg-slate-800/80 hover:bg-slate-800/100 border border-white/5 rounded-xl p-3.5 relative transition-all"
                  >
                    {/* Header line */}
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-mono font-bold text-lime-450">{m.courtName}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-white/50 font-mono">เซ็ต {m.setNumber}</span>
                        {isMatchPoint ? (
                          <span className="bg-amber-500/20 text-amber-305 text-[8px] font-semibold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5 animate-bounce">
                            <Flame className="w-2.5 h-2.5 text-amber-400" /> MATCH POINT
                          </span>
                        ) : (
                          <span className="text-[8px] bg-lime-400/10 text-lime-400 px-1.5 py-0.5 rounded-sm font-mono uppercase font-bold">
                            {m.status}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Score panel layout (Double Grid style representation) */}
                    <div className="grid grid-cols-12 gap-1 items-center bg-slate-950 p-2.5 rounded-lg border border-white/5">
                      {/* Player 1 details */}
                      <div className="col-span-5 text-xs font-semibold truncate text-white pl-1">
                        {m.player1}
                      </div>
                      
                      {/* Interactive dynamic visual court representation with shuttle icon */}
                      <div className="col-span-2 flex items-center justify-center">
                        <Dribbble className="w-3.5 h-3.5 text-lime-400/50 animate-spin" />
                      </div>

                      {/* Player 2 details */}
                      <div className="col-span-5 text-xs font-semibold truncate text-right text-white pr-1">
                        {m.player2}
                      </div>

                      {/* Scores digits row below */}
                      <div className="col-span-5 text-center mt-1.5">
                        <span className="text-2xl font-mono font-bold text-amber-300">{m.score1}</span>
                      </div>
                      <div className="col-span-2 text-center text-[10px] text-white/20 mt-1.5">:</div>
                      <div className="col-span-5 text-center mt-1.5">
                        <span className="text-2xl font-mono font-bold text-lime-400">{m.score2}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Smart Live Gate Queue List representation */}
            <div className="mt-5 pt-4 border-t border-white/10 relative">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-white/60 mb-2 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-lime-400" /> คิวรอเข้าสนามแบดถัดไป (Live Watch Queue)
              </h4>
              <div className="space-y-1.5">
                {queueList.map((q, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800/40 border border-white/5 rounded px-2.5 py-1.5 text-[10px] text-white/70 font-mono truncate"
                  >
                    {q}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
