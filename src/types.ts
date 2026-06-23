/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum MembershipTier {
  GUEST = "Guest Participant",
  SILVER = "Silver Club Member",
  GOLD = "Gold Elite Champion",
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  tier: MembershipTier;
  memberId: string;
  joinedDate: string;
  completedQuizzes: string[]; // Quiz IDs completed
  certificateUrl?: string;
  balance: number; // For booking courts
}

export interface BadmintonCourt {
  id: string;
  name: string;
  courtType: "Premium Rubber" | "Olympic Wooden" | "Standard Turf";
  pricePerHour: number;
  courtColor: string; // Tailwind bg color class
}

export interface Booking {
  id: string;
  courtId: string;
  courtName: string;
  userId: string;
  userName: string;
  userTier: MembershipTier;
  timeSlot: string; // e.g. "15:00 - 16:00"
  bookingType: "Practice Session" | "Match Matchplay" | "Guided Coaching";
  date: string;
  createdAt: string;
}

export interface LiveCourtMatch {
  courtId: string;
  courtName: string;
  player1: string;
  player2: string;
  score1: number;
  score2: number;
  setNumber: number;
  status: "Warmup" | "In Progress" | "Match Point" | "Interval";
}

export interface Coach {
  id: string;
  name: string;
  nameThai: string;
  specialty: string;
  smashSpeed: string;
  avatar: string;
  rating: number;
  availableSlots: string[];
}

export interface AcademyLesson {
  id: string;
  title: string;
  titleThai: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  descriptionThai: string;
  youtubeId?: string;
  points: number;
  steps: {
    title: string;
    details: string;
  }[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AcademyModule {
  id: string;
  title: string;
  titleThai: string;
  lessons: AcademyLesson[];
  quiz: QuizQuestion[];
}
