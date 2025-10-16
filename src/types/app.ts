export type HabitTime = "morning" | "all-day" | "flexible" | "evening" | "night" | "weekend";

export type HabitIconName =
  | "Clock"
  | "Star"
  | "Coffee"
  | "Dumbbell"
  | "Droplets"
  | "Heart"
  | "BookOpen"
  | "Brain"
  | "Target"
  | "Calendar"
  | "BarChart3"
  | "Bed"
  | "Trophy"
  | "Flame"
  | "Smile"
  | "Award"
  | "Zap"
  | "AlarmClock"
  | "Apple"
  | "Bath"
  | "Battery"
  | "Bell"
  | "Bike"
  | "Book"
  | "Check"
  | "Cloud"
  | "Code"
  | "Cookie"
  | "Crown"
  | "Diamond"
  | "Eye"
  | "Feather"
  | "Footprints"
  | "Gamepad2"
  | "Gift"
  | "Glasses"
  | "Globe"
  | "HandHeart"
  | "Headphones"
  | "Leaf"
  | "Lightbulb"
  | "Moon"
  | "Music"
  | "PawPrint"
  | "Pencil"
  | "Phone"
  | "Pin"
  | "Plane"
  | "Plus"
  | "Rocket"
  | "Shield"
  | "Sun"
  | "Timer"
  | "Trees"
  | "Umbrella"
  | "Watch";

export interface HabitDefinition {
  id: string;
  name: string;
  points: number;
  icon: HabitIconName;
  color: string;
  time: HabitTime;
  desc: string;
  notes?: string;
  isCustom?: boolean;
}

export interface Streak {
  count: number;
  lastDate: string | null;
}

export type TaskType = "daily" | "weekly" | "monthly";

export interface Task {
  id: number;
  text: string;
  priority: number;
  completed: boolean;
  createdAt: string;
  type: TaskType;
}

export interface Achievement {
  id: number;
  text: string;
  time: string;
}

export type CompletionType = "habit" | TaskType;

export interface CompletedEntry {
  id: string | number;
  text: string;
  type: CompletionType;
  points: number;
  completedAt: string;
}

export interface Reward {
  id: number;
  name: string;
  cost: number;
  claimed: boolean;
  resetDays: number;
  claimedAt: number | null;
}

export interface RewardPayload {
  name: string;
  cost: number;
  resetDays: number;
}

export interface GratitudeEntry {
  id: number;
  text: string;
  date: string;
}

export interface FinancialBonus {
  id: number;
  name: string;
  points: number;
  desc: string;
}

export type HabitState = Record<string, boolean>;
export type StreakMap = Record<string, Streak>;
export type CompletedHistory = Record<string, CompletedEntry[]>;
