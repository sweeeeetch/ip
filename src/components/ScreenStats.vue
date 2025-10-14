<template>
  <div class="space-y-6 md:space-y-8">
    <div class="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-neutral-100">
      <div class="flex gap-4 flex-row sm:items-center sm:justify-between mb-6 md:mb-8">
        <h3 class="text-xl sm:text-2xl font-light text-neutral-900">Статистика и достижения</h3>
        <button
          @click="exportData"
          class="flex items-center space-x-0 sm:space-x-2 justify-between bg-neutral-100 text-neutral-700 px-4 py-2 text-sm sm:text-base rounded-xl hover:bg-neutral-200 transition-colors">
          <Download class="w-4 h-4" />
          <span class="hidden sm:block">Экспорт</span>
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div class="space-y-4">
          <h4 class="font-medium text-neutral-800 mb-4 sm:mb-6">Текущие показатели</h4>
          <div
            v-for="item in currentStats"
            :key="item.label"
            class="flex justify-between items-center p-4 bg-neutral-50 rounded-xl">
            <span class="text-neutral-700 font-light">{{ item.label }}</span>
            <span class="font-medium text-neutral-900">{{ item.value }}</span>
          </div>
        </div>

        <div class="space-y-6">
          <!-- Лучшие серии -->
          <div>
            <h4 class="font-medium text-neutral-800 mb-4 flex items-center">
              <Flame class="w-5 h-5 mr-2 text-orange-500" />
              Лучшие серии
            </h4>
            <div class="space-y-2">
              <div
                v-if="topStreaks.length === 0"
                class="text-neutral-500 font-light text-sm">
                Серий пока нет
              </div>
              <div
                v-for="[habitKey, streak] in topStreaks"
                :key="habitKey"
                class="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span class="text-sm text-neutral-700">{{ habitDefinitions[habitKey]?.name }}</span>
                <span class="text-sm font-medium text-orange-600">{{ streak.count }} дней</span>
              </div>
            </div>
          </div>

          <!-- Достижения -->
          <div>
            <h4 class="font-medium text-neutral-800 mb-4">Последние достижения</h4>
            <div class="space-y-2 max-h-48 overflow-y-auto">
              <div
                v-if="achievements.length === 0"
                class="text-neutral-500 font-light text-sm">
                Достижений пока нет
              </div>
              <div
                v-for="achievement in achievements.slice(-6).reverse()"
                :key="achievement.id"
                class="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p class="font-medium text-neutral-800 text-sm">{{ achievement.text }}</p>
                <p class="text-xs text-neutral-500 font-light mt-1">{{ achievement.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Информация о сбросе -->
    <div class="bg-neutral-50 rounded-3xl p-6 md:p-8 border border-neutral-200">
      <h4 class="font-medium text-neutral-800 mb-4 flex items-center">
        <RotateCcw class="w-5 h-5 mr-2" />
        Как работает система
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-light text-neutral-600">
        <div>
          <h5 class="font-medium text-neutral-800 mb-2">Ежедневный сброс (00:00)</h5>
          <ul class="space-y-1">
            <li>• Ежедневные привычки сбрасываются</li>
            <li>• Недельные и месячные цели остаются</li>
            <li>• Очки и уровень сохраняются</li>
            <li>• Серии продолжаются при выполнении</li>
          </ul>
        </div>
        <div>
          <h5 class="font-medium text-neutral-800 mb-2">Награды</h5>
          <ul class="space-y-1">
            <li>• Разные периоды сброса (1-30 дней)</li>
            <li>• Кофе и десерты - каждый день</li>
            <li>• SPA и рестораны - раз в неделю</li>
            <li>• Крупные покупки - раз в месяц</li>
          </ul>
        </div>
      </div>
      <p class="mt-4 text-neutral-500 text-xs font-light">До следующего сброса: {{ timeUntilReset }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Download, Flame, RotateCcw } from "lucide-vue-next";

import { getTimeUntilReset } from "@/utils/date";
import type { Achievement, HabitDefinition, HabitState, Streak, StreakMap } from "@/types/app";

const props = defineProps<{
  level: number;
  points: number;
  totalPoints: number;
  week: number;
  mood: number;
  streaks: StreakMap;
  habitDefinitions: Record<string, HabitDefinition>;
  achievements: Achievement[];
  habits?: HabitState;
  pointsToNextLevel?: number;
  completedHabitsCount?: number;
  activeGoalsCount?: number;
  timeUntilReset?: string;
  topStreaks?: Array<[string, Streak]>;
}>();

const emit = defineEmits<{
  exportData: [];
}>();

const totalHabits = computed(() => Object.keys(props.habitDefinitions).length);

const habitsCompleted = computed(() => {
  if (typeof props.completedHabitsCount === "number") return props.completedHabitsCount;
  if (!props.habits) return 0;
  return Object.values(props.habits).filter(Boolean).length;
});

const activeGoals = computed(() => {
  if (typeof props.activeGoalsCount === "number") return props.activeGoalsCount;
  return 0;
});

const pointsToNextLevel = computed(() => {
  if (typeof props.pointsToNextLevel === "number") return props.pointsToNextLevel;
  const target = props.level * 100;
  return Math.max(0, target - props.totalPoints);
});

const streakLeaders = computed(() => {
  if (props.topStreaks) return props.topStreaks;
  return Object.entries(props.streaks)
    .sort(([, a], [, b]) => (b?.count ?? 0) - (a?.count ?? 0))
    .slice(0, 5)
    .filter(([, streak]) => Boolean(streak?.count));
});

const timeUntilReset = computed(() => props.timeUntilReset ?? getTimeUntilReset());

const currentStats = computed(() => [
  { label: "Уровень", value: props.level },
  { label: "Очки накоплено", value: props.points },
  { label: "Всего очков заработано", value: props.totalPoints },
  { label: "Текущая неделя", value: props.week },
  { label: "Выполнено привычек сегодня", value: `${habitsCompleted.value}/${totalHabits.value}` },
  { label: "Активных целей", value: activeGoals.value },
  { label: "Настроение сегодня", value: `${props.mood}/10` },
  { label: "До следующего уровня", value: pointsToNextLevel.value },
]);

const topStreaks = computed(() => streakLeaders.value);

const exportData = () => {
  emit("exportData");
};
</script>

<style scoped></style>
