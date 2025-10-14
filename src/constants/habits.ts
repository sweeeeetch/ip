import type { HabitDefinition, HabitState } from "@/types/app";

type HabitSeed = Omit<HabitDefinition, "id" | "isCustom">;

const baseHabits: Record<string, HabitSeed> = {
  wakeup: { name: "Подъём в срок", points: 2, icon: "Clock", color: "text-blue-600", time: "morning", desc: "В одно время" },
  brush_morning: { name: "Почистить зубы", points: 1, icon: "Star", color: "text-emerald-500", time: "morning", desc: "Утром" },
  breakfast: { name: "Сделать завтрак", points: 2, icon: "Coffee", color: "text-amber-600", time: "morning", desc: "Здоровый" },
  sport: { name: "Утренний спорт", points: 4, icon: "Dumbbell", color: "text-red-500", time: "morning", desc: "30 мин" },
  water_morning: { name: "Стакан воды", points: 1, icon: "Droplets", color: "text-cyan-500", time: "morning", desc: "Натощак" },
  vitamins: { name: "Витамины", points: 1, icon: "Heart", color: "text-pink-500", time: "morning", desc: "С едой" },
  learning_morning: { name: "Саморазвитие", points: 4, icon: "BookOpen", color: "text-violet-600", time: "morning", desc: "30 мин без телефона" },

  water: { name: "2л воды за день", points: 3, icon: "Droplets", color: "text-blue-500", time: "all-day", desc: "В течение дня" },
  no_junk_food: { name: "Без фастфуда", points: 3, icon: "Target", color: "text-green-600", time: "all-day", desc: "Весь день" },
  no_sugar: { name: "Без сахара", points: 3, icon: "Zap", color: "text-yellow-500", time: "all-day", desc: "Контроль сахара" },
  foreign_language: { name: "Иностранный язык", points: 4, icon: "BookOpen", color: "text-purple-600", time: "all-day", desc: "30 мин практики" },
  book_speed: { name: "Быстрое чтение", points: 4, icon: "Brain", color: "text-indigo-600", time: "all-day", desc: "15-30 мин" },
  no_social: { name: "Без соцсетей/мемов", points: 3, icon: "Target", color: "text-neutral-600", time: "all-day", desc: "Час подряд без телефона" },

  planning: { name: "План на завтра", points: 3, icon: "Calendar", color: "text-indigo-500", time: "evening", desc: "Вечером" },
  meditation: { name: "Медитация", points: 3, icon: "Brain", color: "text-purple-500", time: "evening", desc: "10-15 минут" },
  day_review: { name: "Разбор дня", points: 2, icon: "BarChart3", color: "text-orange-500", time: "evening", desc: "Что сделано" },
  sleep: { name: "Сон в срок", points: 4, icon: "Bed", color: "text-slate-500", time: "evening", desc: "В одно время" },
  brush_evening: { name: "Почистить зубы", points: 1, icon: "Star", color: "text-emerald-500", time: "evening", desc: "Перед сном" },

  outdoor_weekend: { name: "4 часа на улице", points: 8, icon: "Coffee", color: "text-green-500", time: "weekend", desc: "За неделю" },
  week_review: { name: "Итоги недели", points: 6, icon: "Trophy", color: "text-yellow-500", time: "weekend", desc: "Анализ" },
};

export const defaultHabitDefinitions: Record<string, HabitDefinition> = Object.entries(baseHabits).reduce((acc, [id, habit]) => {
  acc[id] = { id, ...habit };
  return acc;
}, {} as Record<string, HabitDefinition>);

export const createDefaultHabitState = (definitions: Record<string, HabitDefinition>): HabitState => {
  return Object.keys(definitions).reduce<HabitState>((acc, key) => {
    acc[key] = false;
    return acc;
  }, {});
};
