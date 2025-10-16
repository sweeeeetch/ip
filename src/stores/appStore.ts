import { computed, ref, watch, type Ref } from "vue";
import { defineStore } from "pinia";

import { createDefaultHabitState, defaultHabitDefinitions } from "@/constants/habits";
import { defaultRewards, financialBonuses } from "@/constants/rewards";
import { getDateKey, getTimeUntilReset } from "@/utils/date";
import { readStorage, writeStorage } from "@/utils/storage";
import type {
  Achievement,
  CompletedEntry,
  CompletedHistory,
  GratitudeEntry,
  HabitDefinition,
  HabitState,
  HabitTime,
  Reward,
  RewardPayload,
  Streak,
  StreakMap,
  Task,
  TaskType,
} from "@/types/app";

export type ImportResult = {
  success: boolean;
  message?: string;
};

const STORAGE_KEYS = {
  week: "ip-week",
  points: "ip-points",
  level: "ip-level",
  totalPoints: "ip-totalPoints",
  habits: "ip-habits",
  habitDefinitions: "ip-habitDefinitions",
  streaks: "ip-streaks",
  dailyTasks: "ip-dailyTasks",
  weeklyGoals: "ip-weeklyGoals",
  monthlyProjects: "ip-monthlyProjects",
  mood: "ip-todayMood",
  gratitude: "ip-gratitude",
  achievements: "ip-achievements",
  weekPlan: "ip-weekPlan",
  rewards: "ip-rewards",
  completedHistory: "ip-completedHistory",
  lastResetDate: "ip-lastReset",
} as const;

const MAX_WEEK_POINTS = 70;
const LEVEL_STEP = 100;

const HABIT_TIMES: HabitTime[] = ["morning", "all-day", "evening", "weekend", "flexible", "night"];

let resetIntervalId: number | undefined;

type HabitUpsertPayload = {
  name: string;
  icon: HabitDefinition["icon"];
  points: number;
  desc: string;
  notes?: string;
  time: HabitDefinition["time"];
  color: string;
};

const isPlainRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isFiniteNumber = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value);

const normalizeHabitDefinitions = (definitions: Record<string, any>): Record<string, HabitDefinition> => {
  const entries = Object.entries(definitions ?? {});
  if (!entries.length) {
    return { ...defaultHabitDefinitions };
  }

  return entries.reduce<Record<string, HabitDefinition>>((acc, [id, raw]) => {
    if (!raw || typeof raw !== "object") {
      return acc;
    }

    let rawTime = raw.time as HabitTime | undefined;
    if (rawTime === "flexible") rawTime = "all-day";
    if (rawTime === "night") rawTime = "evening";
    const resolvedTime = HABIT_TIMES.includes(rawTime ?? "all-day") ? (rawTime as HabitTime) : "all-day";

    const defaultColor = defaultHabitDefinitions[id]?.color ?? "text-neutral-600";
    const resolvedColor = typeof raw.color === "string" ? raw.color : defaultColor;

    const normalized: HabitDefinition = {
      id,
      name: typeof raw.name === "string" ? raw.name : id,
      icon: typeof raw.icon === "string" ? raw.icon : "Star",
      points: Number.isFinite(raw.points) ? Number(raw.points) : 1,
      desc: typeof raw.desc === "string" ? raw.desc : "",
      time: resolvedTime,
      color: resolvedColor,
      notes: typeof raw.notes === "string" && raw.notes.length > 0 ? raw.notes : undefined,
      isCustom: Boolean(raw.isCustom || String(id).startsWith("custom-")),
    };

    acc[id] = normalized;
    return acc;
  }, {});
};

const persist = <T>(source: Ref<T>, key: string, deep = false) => {
  watch(
    source,
    value => {
      writeStorage(key, value);
    },
    { deep }
  );
};

const ensureStreak = (streak: Streak | undefined): Streak => {
  if (streak) return { ...streak };
  return { count: 0, lastDate: null };
};

export const useAppStore = defineStore("app", () => {
  const habitDefinitions = ref<Record<string, HabitDefinition>>(
    normalizeHabitDefinitions(readStorage(STORAGE_KEYS.habitDefinitions, defaultHabitDefinitions))
  );

  const week = ref<number>(readStorage(STORAGE_KEYS.week, 1));
  const points = ref<number>(readStorage(STORAGE_KEYS.points, 0));
  const level = ref<number>(readStorage(STORAGE_KEYS.level, 1));
  const totalPoints = ref<number>(readStorage(STORAGE_KEYS.totalPoints, 0));
  const lastResetDate = ref<string>(readStorage(STORAGE_KEYS.lastResetDate, new Date().toDateString()));

  const habits = ref<HabitState>({
    ...createDefaultHabitState(habitDefinitions.value),
    ...readStorage(STORAGE_KEYS.habits, {}),
  });
  const streaks = ref<StreakMap>(readStorage(STORAGE_KEYS.streaks, {}));

  const dailyTasks = ref<Task[]>(readStorage(STORAGE_KEYS.dailyTasks, []));
  const weeklyGoals = ref<Task[]>(readStorage(STORAGE_KEYS.weeklyGoals, []));
  const monthlyProjects = ref<Task[]>(readStorage(STORAGE_KEYS.monthlyProjects, []));

  const mood = ref<number>(readStorage(STORAGE_KEYS.mood, 5));
  const gratitude = ref<GratitudeEntry[]>(readStorage(STORAGE_KEYS.gratitude, []));

  const achievements = ref<Achievement[]>(readStorage(STORAGE_KEYS.achievements, []));
  const weekPlan = ref<Record<string, string>>(readStorage(STORAGE_KEYS.weekPlan, {}));
  const rewards = ref<Reward[]>(readStorage(STORAGE_KEYS.rewards, defaultRewards));
  const completedHistory = ref<CompletedHistory>(readStorage(STORAGE_KEYS.completedHistory, {}));

  const maxPoints = MAX_WEEK_POINTS;
  const getTimeUntilResetText = () => getTimeUntilReset();
  const timeUntilReset = ref(getTimeUntilResetText());

  const syncHabitState = () => {
    const nextHabits: HabitState = { ...habits.value };
    let dirty = false;

    Object.keys(habitDefinitions.value).forEach(key => {
      if (!(key in nextHabits)) {
        nextHabits[key] = false;
        dirty = true;
      }
    });

    Object.keys(nextHabits).forEach(key => {
      if (!habitDefinitions.value[key]) {
        delete nextHabits[key];
        dirty = true;
      }
    });

    if (dirty) {
      habits.value = nextHabits;
    }

    const nextStreaks: StreakMap = { ...streaks.value };
    let streaksDirty = false;
    Object.keys(nextStreaks).forEach(key => {
      if (!habitDefinitions.value[key]) {
        delete nextStreaks[key];
        streaksDirty = true;
      }
    });
    if (streaksDirty) {
      streaks.value = nextStreaks;
    }
  };

  syncHabitState();

  const weekProgress = computed(() => Math.min((points.value / maxPoints) * 100, 100));
  const completedHabitsCount = computed(() => Object.values(habits.value).filter(Boolean).length);

  const activeGoalsCount = computed(() => {
    const activeDaily = dailyTasks.value.filter(task => !task.completed).length;
    const activeWeekly = weeklyGoals.value.filter(task => !task.completed).length;
    const activeMonthly = monthlyProjects.value.filter(task => !task.completed).length;
    return activeDaily + activeWeekly + activeMonthly;
  });

  const topStreaks = computed(() =>
    Object.entries(streaks.value)
      .sort(([, a], [, b]) => (b?.count ?? 0) - (a?.count ?? 0))
      .slice(0, 5)
      .filter(([, streak]) => Boolean(streak?.count))
  );

  const calculateLevel = (totalPts: number) => Math.floor(totalPts / LEVEL_STEP) + 1;

  const pointsToNextLevel = computed(() => {
    const target = level.value * LEVEL_STEP;
    return Math.max(0, target - totalPoints.value);
  });

  const addAchievement = (text: string) => {
    const newAchievement: Achievement = {
      id: Date.now(),
      text,
      time: new Date().toLocaleTimeString(),
    };
    achievements.value = [...achievements.value, newAchievement];
  };

  const updatePoints = (pointsToAdd: number) => {
    points.value += pointsToAdd;
    totalPoints.value += pointsToAdd;
    const newLevel = calculateLevel(totalPoints.value);
    if (newLevel > level.value) {
      level.value = newLevel;
      addAchievement(`🆙 Уровень ${newLevel} достигнут!`);
    }
  };

  const updateStreak = (habitKey: string, completed: boolean) => {
    const today = new Date().toDateString();
    const current = ensureStreak(streaks.value[habitKey]);
    const definition = habitDefinitions.value[habitKey];

    if (!definition) return;

    if (completed) {
      if (current.lastDate !== today) {
        current.count += 1;
        current.lastDate = today;
        if (current.count === 7) addAchievement(`🔥 ${definition.name}: 7 дней подряд!`);
        if (current.count === 30) addAchievement(`💎 ${definition.name}: месяц без перерыва!`);
      }
    } else {
      current.count = 0;
    }

    streaks.value = { ...streaks.value, [habitKey]: current };
  };

  const appendHistory = (entry: CompletedEntry, dateKey: string = getDateKey()) => {
    const dayHistory = completedHistory.value[dateKey] ?? [];
    completedHistory.value = {
      ...completedHistory.value,
      [dateKey]: [...dayHistory, entry],
    };
  };

  const removeHistoryEntry = (entryId: string | number, dateKey: string) => {
    const dayHistory = completedHistory.value[dateKey] ?? [];
    completedHistory.value = {
      ...completedHistory.value,
      [dateKey]: dayHistory.filter(item => item.id !== entryId),
    };
  };

  const toggleHabit = (habitKey: string) => {
    const habit = habitDefinitions.value[habitKey];
    if (!habit) return;

    const todayKey = getDateKey();
    const isActive = Boolean(habits.value[habitKey]);
    habits.value = { ...habits.value, [habitKey]: !isActive };

    if (!isActive) {
      updatePoints(habit.points);
      updateStreak(habitKey, true);
      appendHistory({
        id: `habit-${habitKey}`,
        text: habit.name,
        type: "habit",
        points: habit.points,
        completedAt: new Date().toLocaleTimeString(),
      });
    } else {
      points.value = Math.max(0, points.value - habit.points);
      updateStreak(habitKey, false);
      removeHistoryEntry(`habit-${habitKey}`, todayKey);
    }
  };

  const createTask = (payload: { text: string; priority: number; type: TaskType }) => {
    const task: Task = {
      id: Date.now(),
      text: payload.text,
      priority: payload.priority,
      completed: false,
      createdAt: new Date().toISOString(),
      type: payload.type,
    };

    if (payload.type === "daily") {
      dailyTasks.value = [...dailyTasks.value, task];
    } else if (payload.type === "weekly") {
      weeklyGoals.value = [...weeklyGoals.value, task];
    } else {
      monthlyProjects.value = [...monthlyProjects.value, task];
    }
  };

  const toggleTask = (taskId: number, taskType: TaskType) => {
    const todayKey = getDateKey();

    const toggleInCollection = (collection: Task[]): Task[] => {
      return collection.map(task => {
        if (task.id !== taskId) return task;
        const completed = !task.completed;

        if (completed) {
          updatePoints(task.priority);
          appendHistory({
            id: task.id,
            text: task.text,
            type: task.type,
            points: task.priority,
            completedAt: new Date().toLocaleTimeString(),
          });
        } else {
          points.value = Math.max(0, points.value - task.priority);
          removeHistoryEntry(task.id, todayKey);
        }

        return { ...task, completed };
      });
    };

    if (taskType === "daily") {
      dailyTasks.value = toggleInCollection(dailyTasks.value);
    } else if (taskType === "weekly") {
      weeklyGoals.value = toggleInCollection(weeklyGoals.value);
    } else {
      monthlyProjects.value = toggleInCollection(monthlyProjects.value);
    }
  };

  const updateMood = (newMood: number) => {
    mood.value = newMood;
  };

  const updateTaskText = (taskId: number, taskType: TaskType, text: string) => {
    const updater = (collection: Task[]): Task[] =>
      collection.map(task => (task.id === taskId ? { ...task, text } : task));

    if (taskType === "daily") {
      dailyTasks.value = updater(dailyTasks.value);
    } else if (taskType === "weekly") {
      weeklyGoals.value = updater(weeklyGoals.value);
    } else {
      monthlyProjects.value = updater(monthlyProjects.value);
    }
  };

  const deleteTask = (taskId: number, taskType: TaskType) => {
    if (taskType === "daily") {
      dailyTasks.value = dailyTasks.value.filter(task => task.id !== taskId);
    } else if (taskType === "weekly") {
      weeklyGoals.value = weeklyGoals.value.filter(task => task.id !== taskId);
    } else {
      monthlyProjects.value = monthlyProjects.value.filter(task => task.id !== taskId);
    }
  };

  const addGratitude = (entry: GratitudeEntry) => {
    gratitude.value = [...gratitude.value, entry];
  };

  const deleteGratitude = (entryId: number) => {
    gratitude.value = gratitude.value.filter(entry => entry.id !== entryId);
  };

  const addFinancialBonus = (bonusId: number) => {
    const bonus = financialBonuses.find(item => item.id === bonusId);
    if (!bonus) return;

    updatePoints(bonus.points);
    addAchievement(`💰 ${bonus.name}: +${bonus.points} очков!`);
  };

  const claimReward = (rewardId: number) => {
    const index = rewards.value.findIndex(item => item.id === rewardId);
    if (index === -1) return;

    const reward = rewards.value[index]!;
    if (reward.claimed || points.value < reward.cost) return;

    points.value -= reward.cost;
    addAchievement(`🎁 Награда: ${reward.name}!`);

    const updated = [...rewards.value];
    updated[index] = { ...reward, claimed: true, claimedAt: Date.now() };
    rewards.value = updated;
  };

  const addReward = (payload: RewardPayload) => {
    const newReward: Reward = {
      id: Date.now(),
      name: payload.name,
      cost: Math.max(1, Number(payload.cost) || 1),
      resetDays: Math.max(1, Number(payload.resetDays) || 1),
      claimed: false,
      claimedAt: null,
    };

    rewards.value = [...rewards.value, newReward];
  };

  const updateReward = (rewardId: number, payload: RewardPayload) => {
    const normalizedCost = Math.max(1, Number(payload.cost) || 1);
    const normalizedResetDays = Math.max(1, Number(payload.resetDays) || 1);

    rewards.value = rewards.value.map(reward =>
      reward.id === rewardId
        ? {
            ...reward,
            name: payload.name,
            cost: normalizedCost,
            resetDays: normalizedResetDays,
          }
        : reward
    );
  };

  const deleteReward = (rewardId: number) => {
    rewards.value = rewards.value.filter(reward => reward.id !== rewardId);
  };

  const upsertHabitDefinition = (id: string | null, payload: HabitUpsertPayload) => {
    const targetId = id ?? `custom-${Date.now()}`;
    const existing = habitDefinitions.value[targetId];
    const normalizedTime = payload.time === "flexible" ? "all-day" : payload.time === "night" ? "evening" : payload.time;
    const baseDefinition = defaultHabitDefinitions[targetId];
    const time = normalizedTime ?? existing?.time ?? baseDefinition?.time ?? "all-day";
    const color = payload.color ?? existing?.color ?? baseDefinition?.color ?? "text-neutral-600";

    const nextDefinition: HabitDefinition = {
      id: targetId,
      name: payload.name,
      icon: payload.icon,
      points: payload.points,
      desc: payload.desc,
      time,
      color,
      notes: payload.notes,
      isCustom: existing?.isCustom ?? targetId.startsWith("custom-"),
    };

    habitDefinitions.value = {
      ...habitDefinitions.value,
      [targetId]: nextDefinition,
    };

    if (!existing) {
      habits.value = { ...habits.value, [targetId]: false };
    }
  };

  const deleteHabitDefinition = (id: string) => {
    if (!habitDefinitions.value[id]) return;

    const nextDefinitions = { ...habitDefinitions.value };
    delete nextDefinitions[id];
    habitDefinitions.value = nextDefinitions;

    const nextHabits = { ...habits.value };
    delete nextHabits[id];
    habits.value = nextHabits;

    const nextStreaks = { ...streaks.value };
    delete nextStreaks[id];
    streaks.value = nextStreaks;
  };

  const resetDailyHabits = () => {
    const nextState: HabitState = { ...habits.value };
    Object.entries(habitDefinitions.value).forEach(([key, config]) => {
      if (config.time !== "weekend") {
        nextState[key] = false;
      }
    });
    habits.value = nextState;
  };

  const resetRewards = () => {
    rewards.value = rewards.value.map(reward => {
      if (reward.claimed && reward.claimedAt) {
        const daysSinceClaim = Math.floor((Date.now() - reward.claimedAt) / (24 * 60 * 60 * 1000));
        if (daysSinceClaim >= reward.resetDays) {
          return { ...reward, claimed: false, claimedAt: null };
        }
      }
      return reward;
    });
  };

  const checkForDailyReset = () => {
    const today = new Date().toDateString();
    if (today === lastResetDate.value) return;

    resetDailyHabits();
    resetRewards();
    lastResetDate.value = today;

    const isMonday = new Date().getDay() === 1;
    if (isMonday) {
      week.value += 1;
      addAchievement(`🎯 Неделя ${week.value} началась!`);
    } else {
      addAchievement("🌅 Новый день!");
    }

    timeUntilReset.value = getTimeUntilResetText();
  };

  const createExportSnapshot = () => {
    const payload = {
      week: week.value,
      points: points.value,
      level: level.value,
      totalPoints: totalPoints.value,
      habits: habits.value,
      habitDefinitions: habitDefinitions.value,
      streaks: streaks.value,
      dailyTasks: dailyTasks.value,
      weeklyGoals: weeklyGoals.value,
      monthlyProjects: monthlyProjects.value,
      mood: mood.value,
      gratitude: gratitude.value,
      achievements: achievements.value,
      exportDate: new Date().toISOString(),
    };

    addAchievement("📊 Данные экспортированы!");
    return payload;
  };

  type ExportSnapshot = ReturnType<typeof createExportSnapshot>;

  const restoreFromSnapshot = (rawSnapshot: unknown): ImportResult => {
    if (!isPlainRecord(rawSnapshot)) {
      return { success: false, message: "Файл не похож на резервную копию." };
    }

    const snapshot = rawSnapshot as Record<string, unknown>;
    const rawWeek = snapshot.week;
    const rawPoints = snapshot.points;
    const rawLevel = snapshot.level;
    const rawTotalPoints = snapshot.totalPoints;
    const rawHabitDefinitions = snapshot.habitDefinitions;

    if (
      !isFiniteNumber(rawWeek) ||
      !isFiniteNumber(rawPoints) ||
      !isFiniteNumber(rawLevel) ||
      !isFiniteNumber(rawTotalPoints) ||
      !isPlainRecord(rawHabitDefinitions)
    ) {
      return { success: false, message: "Обязательные поля отсутствуют или повреждены." };
    }

    const safeHabitDefinitions = normalizeHabitDefinitions(rawHabitDefinitions as Record<string, any>);

    const sanitizeHabitState = (value: unknown, definitions: Record<string, HabitDefinition>): HabitState => {
      const base: HabitState = {};
      Object.keys(definitions).forEach(key => {
        base[key] = false;
      });

      if (!isPlainRecord(value)) return base;
      Object.entries(value).forEach(([key, val]) => {
        if (!definitions[key]) return;
        base[key] = Boolean(val);
      });

      return base;
    };

    const sanitizeStreakMap = (value: unknown, definitions: Record<string, HabitDefinition>): StreakMap => {
      if (!isPlainRecord(value)) return {};

      return Object.entries(value).reduce<StreakMap>((acc, [key, streakRaw]) => {
        if (!definitions[key]) return acc;
        if (!isPlainRecord(streakRaw)) return acc;

        const count = Number(streakRaw.count);
        const lastDate = typeof streakRaw.lastDate === "string" ? streakRaw.lastDate : null;
        acc[key] = {
          count: Number.isFinite(count) && count > 0 ? Math.floor(count) : 0,
          lastDate,
        };
        return acc;
      }, {});
    };

    const sanitizeTaskCollection = (value: unknown, fallbackType: TaskType): Task[] => {
      if (!Array.isArray(value)) return [];

      return value
        .map(item => {
          if (!isPlainRecord(item)) return null;

          const idNumeric = Number(item.id);
          const fallbackId = Date.now() + Math.floor(Math.random() * 1000);
          const id = Number.isFinite(idNumeric) ? idNumeric : fallbackId;
          const textRaw = typeof item.text === "string" ? item.text.trim() : "";
          const text = textRaw.length > 0 ? textRaw : "Задача";
          const priorityNumeric = Number(item.priority);
          const priority = Number.isFinite(priorityNumeric) ? Math.max(0, Math.floor(priorityNumeric)) : 0;
          const completed = Boolean(item.completed);
          const createdAt = typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString();
          const rawType = item.type;
          const type =
            rawType === "daily" || rawType === "weekly" || rawType === "monthly" ? (rawType as TaskType) : fallbackType;

          return {
            id,
            text,
            priority,
            completed,
            createdAt,
            type,
          } satisfies Task;
        })
        .filter((task): task is Task => Boolean(task));
    };

    const sanitizeGratitude = (value: unknown): GratitudeEntry[] => {
      if (!Array.isArray(value)) return [];

      return value
        .map(item => {
          if (!isPlainRecord(item)) return null;
          const textRaw = typeof item.text === "string" ? item.text.trim() : "";
          if (!textRaw) return null;

          const idNumeric = Number(item.id);
          const fallbackId = Date.now() + Math.floor(Math.random() * 1000);
          const id = Number.isFinite(idNumeric) ? idNumeric : fallbackId;
          const date = typeof item.date === "string" ? item.date : new Date().toDateString();

          return {
            id,
            text: textRaw,
            date,
          } satisfies GratitudeEntry;
        })
        .filter((entry): entry is GratitudeEntry => Boolean(entry));
    };

    const sanitizeAchievements = (value: unknown): Achievement[] => {
      if (!Array.isArray(value)) return [];

      return value
        .map(item => {
          if (!isPlainRecord(item)) return null;
          const textRaw = typeof item.text === "string" ? item.text.trim() : "";
          if (!textRaw) return null;

          const idNumeric = Number(item.id);
          const fallbackId = Date.now() + Math.floor(Math.random() * 1000);
          const id = Number.isFinite(idNumeric) ? idNumeric : fallbackId;
          const time = typeof item.time === "string" ? item.time : new Date().toLocaleTimeString();

          return {
            id,
            text: textRaw,
            time,
          } satisfies Achievement;
        })
        .filter((entry): entry is Achievement => Boolean(entry));
    };

    const sanitizedHabits = sanitizeHabitState(snapshot.habits, safeHabitDefinitions);
    const sanitizedStreaks = sanitizeStreakMap(snapshot.streaks, safeHabitDefinitions);
    const sanitizedDailyTasks = sanitizeTaskCollection(snapshot.dailyTasks, "daily");
    const sanitizedWeeklyTasks = sanitizeTaskCollection(snapshot.weeklyGoals, "weekly");
    const sanitizedMonthlyTasks = sanitizeTaskCollection(snapshot.monthlyProjects, "monthly");
    const sanitizedGratitude = sanitizeGratitude(snapshot.gratitude);
    const sanitizedAchievements = sanitizeAchievements(snapshot.achievements);

    const resolvedWeek = Math.max(1, Math.floor(rawWeek));
    const resolvedPoints = Math.max(0, Math.floor(rawPoints));
    const resolvedLevel = Math.max(1, Math.floor(rawLevel));
    const resolvedTotalPoints = Math.max(resolvedPoints, Math.floor(rawTotalPoints));
    const resolvedMood = (() => {
      const moodRaw = snapshot.mood;
      if (!isFiniteNumber(moodRaw)) return mood.value;
      const moodNumeric = Math.floor(moodRaw);
      return Math.min(10, Math.max(1, moodNumeric));
    })();

    week.value = resolvedWeek;
    points.value = resolvedPoints;
    level.value = resolvedLevel;
    totalPoints.value = resolvedTotalPoints;
    habitDefinitions.value = safeHabitDefinitions;
    habits.value = sanitizedHabits;
    streaks.value = sanitizedStreaks;
    dailyTasks.value = sanitizedDailyTasks;
    weeklyGoals.value = sanitizedWeeklyTasks;
    monthlyProjects.value = sanitizedMonthlyTasks;
    mood.value = resolvedMood;
    gratitude.value = sanitizedGratitude;
    achievements.value = sanitizedAchievements;

    syncHabitState();
    timeUntilReset.value = getTimeUntilResetText();

    addAchievement("📥 Данные восстановлены из резервной копии.");
    return { success: true };
  };

  const getDayTotalPoints = (dateKey: string) => (completedHistory.value[dateKey] ?? []).reduce((sum, item) => sum + item.points, 0);

  const updateWeekPlan = (nextPlan: Record<string, string>) => {
    weekPlan.value = { ...nextPlan };
  };

  // Persistence
  persist(habitDefinitions, STORAGE_KEYS.habitDefinitions, true);
  persist(week, STORAGE_KEYS.week);
  persist(points, STORAGE_KEYS.points);
  persist(level, STORAGE_KEYS.level);
  persist(totalPoints, STORAGE_KEYS.totalPoints);
  persist(lastResetDate, STORAGE_KEYS.lastResetDate);
  persist(habits, STORAGE_KEYS.habits, true);
  persist(streaks, STORAGE_KEYS.streaks, true);
  persist(dailyTasks, STORAGE_KEYS.dailyTasks, true);
  persist(weeklyGoals, STORAGE_KEYS.weeklyGoals, true);
  persist(monthlyProjects, STORAGE_KEYS.monthlyProjects, true);
  persist(mood, STORAGE_KEYS.mood);
  persist(gratitude, STORAGE_KEYS.gratitude, true);
  persist(achievements, STORAGE_KEYS.achievements, true);
  persist(weekPlan, STORAGE_KEYS.weekPlan, true);
  persist(rewards, STORAGE_KEYS.rewards, true);
  persist(completedHistory, STORAGE_KEYS.completedHistory, true);

  if (typeof window !== "undefined" && resetIntervalId === undefined) {
    checkForDailyReset();
    timeUntilReset.value = getTimeUntilResetText();
    resetIntervalId = window.setInterval(() => {
      checkForDailyReset();
      timeUntilReset.value = getTimeUntilResetText();
    }, 60_000);
  }

  watch(habitDefinitions, () => {
    syncHabitState();
  });

  return {
    // state
    habitDefinitions,
    week,
    points,
    level,
    totalPoints,
    lastResetDate,
    habits,
    streaks,
    dailyTasks,
    weeklyGoals,
    monthlyProjects,
    mood,
    gratitude,
    achievements,
    weekPlan,
    rewards,
    completedHistory,
    maxPoints,
    timeUntilReset,
    // constants
    financialBonuses,
    // computed
    weekProgress,
    completedHabitsCount,
    activeGoalsCount,
    topStreaks,
    pointsToNextLevel,
    // actions
    toggleHabit,
    createTask,
    toggleTask,
    updateMood,
    addGratitude,
    deleteGratitude,
    addFinancialBonus,
    claimReward,
    addReward,
    updateReward,
    deleteReward,
    checkForDailyReset,
    createExportSnapshot,
    restoreFromSnapshot,
    getDayTotalPoints,
    updateWeekPlan,
    getTimeUntilResetText,
    upsertHabitDefinition,
    deleteHabitDefinition,
    updateTaskText,
    deleteTask,
  };
});
