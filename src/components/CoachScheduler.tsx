/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { UserProfile, Coach, Booking, MembershipTier } from "../types";
import { motion } from "motion/react";
import { Star, Flame, Award, Shield, Check, CalendarDays, Clock, BadgeCheck } from "lucide-react";

interface CoachSchedulerProps {
  user: UserProfile;
  onChangeUser: (updated: UserProfile) => void;
  bookings: Booking[];
  onAddBooking: (booking: Booking) => void;
}

const COACHES: Coach[] = [
  {
    id: "co-1",
    name: "Coach Bas",
    nameThai: "โค้ชบาส (อดีตทีมชาติเดี่ยว)",
    specialty: "สอนเทคนิคการก้าวเท้าถอยหลัง & คิลลูกตบความเร็วสูง",
    smashSpeed: "415 km/h",
    avatar: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200",
    rating: 4.9,
    availableSlots: ["09:00 - 10:00", "13:00 - 14:00", "17:00 - 18:00"],
  },
  {
    id: "co-2",
    name: "Coach Ice",
    nameThai: "โค้ชไอซ์ (แชมป์ระดับสหมิตร)",
    specialty: "ปั้นทักษะลูกตัดแฉลบ หยอดเฉียดเน็ต & คอร์ดิเนชันคู่",
    smashSpeed: "380 km/h",
    avatar: "https://images.unsplash.com/photo-1548685913-fe6574ab8914?auto=format&fit=crop&q=80&w=200",
    rating: 4.8,
    availableSlots: ["10:00 - 11:00", "15:00 - 16:00", "19:00 - 20:00"],
  },
  {
    id: "co-3",
    name: "Coach Glab",
    nameThai: "โค้ชแกลบ (ผู้เชี่ยวชาญระดับเยาวชน)",
    specialty: "สอนจับจังหวะสวิง ลูกเคลียร์หลังแดนล่องลอยเซฟข้อศอก",
    smashSpeed: "350 km/h",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    rating: 4.7,
    availableSlots: ["11:00 - 12:00", "14:00 - 15:00", "20:00 - 21:00"],
  },
];

export default function CoachScheduler({ user, onChangeUser, bookings, onAddBooking }: CoachSchedulerProps) {
  const [selectedCoach, setSelectedCoach] = useState<Coach>(COACHES[0]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const calculateLessonCost = () => {
    // Standard coach cost per hour: ฿450
    const baseCost = 450;
    let discount = 0;
    if (user.tier === MembershipTier.SILVER) discount = 45; // 10%
    if (user.tier === MembershipTier.GOLD) discount = 112.5; // 25%

    return { base: baseCost, discount, final: baseCost - discount };
  };

  const handleBookLesson = (slot: string) => {
    // Check if slot with coach or court is already busy
    const isSlotBusy = bookings.some(
      (b) => b.timeSlot === slot && b.bookingType === "Guided Coaching" && b.courtId === "crt-3"
    );

    if (isSlotBusy) {
      setFeedback("⚠️ ช่วงเวลานี้โค้ชหรือครูฝึกติดภารกิจฝึกซ้อมนักกีฬาประเภทอื่นอยู่ครับ กรุณาเลือกชั่วโมงอื่น");
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    const { final } = calculateLessonCost();
    if (user.balance < final) {
      setFeedback("❌ ยอดเงินของคุณไม่พอจ่ายค่าโค้ชชิ่งจำลอง กรุณาเติมเงินคงเหลือระดับ ฿" + final + " ที่ประวัติสมาชิก");
      setTimeout(() => setFeedback(null), 3500);
      return;
    }

    // Register booking connected to Court C (or academic)
    const newBooking: Booking = {
      id: `booking-co-${Date.now()}`,
      courtId: "crt-3", // Academy court
      courtName: `Coaching with ${selectedCoach.name}`,
      userId: user.id,
      userName: user.name,
      userTier: user.tier,
      timeSlot: slot,
      bookingType: "Guided Coaching",
      date: "2026-06-12",
      createdAt: new Date().toLocaleTimeString("th-TH"),
    };

    onChangeUser({ ...user, balance: user.balance - final });
    onAddBooking(newBooking);
    
    setFeedback(`🎉 จองชั่วโมงเรียนกับ ${selectedCoach.name} รอบ ${slot} สำเร็จ! ยอดหักจากบัญชี ฿${final}`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const { final } = calculateLessonCost();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-xl font-display font-bold text-slate-800 flex items-center gap-2">
            <CalendarDays className="text-indigo-900 w-5.5 h-5.5" />
            ตารางจองแมตช์สอนคู่โค้ช (Pro Trainer Booking Service)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            ยกระดับทักษะของคุณกับโค้ชระดับมืออาชีพ คอร์สเรียนตัวต่อตัวหรือจัดกลุ่มสวิง
          </p>
        </div>
        <div className="bg-indigo-55 text-indigo-900 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-mono font-bold">
          ราคาโปรลดแรง: <strong className="font-bold">฿{final} / ชม.</strong>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-indigo-50 border border-indigo-100 text-indigo-900 text-xs rounded-xl mb-6 text-center font-bold animate-pulse">
          {feedback}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Coaches cards grid */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {COACHES.map((coach) => {
            const isSelected = selectedCoach.id === coach.id;
            return (
              <div
                key={coach.id}
                onClick={() => setSelectedCoach(coach)}
                className={`border rounded-xl p-4 cursor-pointer transition-all flex flex-col justify-between relative group ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/20 shadow-md ring-1 ring-indigo-500/20"
                    : "border-slate-200 bg-white hover:border-slate-350"
                }`}
              >
                <div>
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border border-slate-200 mb-3 mx-auto">
                    <img
                      src={coach.avatar}
                      alt={coach.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-all"
                    />
                    {coach.rating >= 4.8 && (
                      <span className="absolute bottom-0 right-0 bg-amber-450 border border-white text-slate-950 p-0.5 rounded-full text-[6px]">
                        ★
                      </span>
                    )}
                  </div>

                  <div className="text-center">
                    <p className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1">
                      {coach.name}
                      <BadgeCheck className="w-3.5 h-3.5 text-indigo-900" />
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{coach.nameThai}</p>
                  </div>

                  <p className="text-[10px] text-slate-500 text-center mt-3 leading-relaxed min-h-[40px]">
                    {coach.specialty}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-200 flex justify-between items-center text-[10px]">
                  <span className="text-slate-400 font-mono text-[9px]">Smash record:</span>
                  <span className="font-bold text-amber-600 font-mono flex items-center gap-0.5 text-[9px]">
                    <Flame className="w-3 h-3 text-amber-500" /> {coach.smashSpeed}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT: Available hours for selected coach */}
        <div className="lg:col-span-4 bg-slate-50 border border-slate-205 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-slate-650 text-xs font-bold uppercase tracking-wider mb-4 pb-2 border-b border-slate-200">
              <Clock className="w-4 h-4 text-indigo-900" />
              ตารางว่างของ {selectedCoach.name} วันนี้
            </div>

            <div className="space-y-2.5">
              {selectedCoach.availableSlots.map((slot) => {
                const isBooked = bookings.some(
                  (b) =>
                    b.timeSlot === slot &&
                    b.bookingType === "Guided Coaching" &&
                    b.courtName.includes(selectedCoach.name)
                );

                return (
                  <button
                    key={slot}
                    onClick={() => !isBooked && handleBookLesson(slot)}
                    disabled={isBooked}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border text-xs transition-all text-left ${
                      isBooked
                        ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-white border-slate-200 hover:bg-indigo-55/30 hover:border-indigo-400 text-slate-700 cursor-pointer"
                    }`}
                  >
                    <span className="font-mono font-medium">{slot}</span>
                    {isBooked ? (
                      <span className="text-[9px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded font-mono">
                        ติดสอนแล้ว
                      </span>
                    ) : (
                      <span className="text-[9px] bg-lime-400 border border-lime-450 text-indigo-900 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                        จองคุมสอน (฿{final})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 text-[10px] text-slate-400 bg-white border border-slate-200 rounded-lg p-3">
             สัญญาสิทธิพิเศษสมาชิก: ยิ่งเลือกเรียนต่อเนื่องยิ่งสะสมคะแนนเพิ่ม 150 EXP สำหรับใช้ยื่นจัดใบประกาศเกียรติบัตรรับรองปลายระดับได้ทันที
          </div>
        </div>
      </div>
    </div>
  );
}
