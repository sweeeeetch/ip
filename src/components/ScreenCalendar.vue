<template>
  <div class="space-y-6 md:space-y-8">
    <!-- Календарь -->
    <div class="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-neutral-100">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8">
        <div>
          <h3 class="text-xl sm:text-2xl font-light text-neutral-900">Календарь достижений</h3>
          <p class="text-sm sm:text-base text-neutral-600 font-light">История выполненных задач и привычек</p>
        </div>

        <div class="flex items-center justify-between gap-3 sm:justify-end">
          <button
            @click="navigateMonth(-1)"
            class="p-2 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors">
            <ChevronLeft class="w-5 h-5 text-neutral-600" />
          </button>
          <h4 class="text-lg font-medium text-neutral-800 min-w-[140px] text-center">
            {{ currentMonth.toLocaleDateString("ru-RU", { month: "long", year: "numeric" }) }}
          </h4>
          <button
            @click="navigateMonth(1)"
            class="p-2 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors">
            <ChevronRight class="w-5 h-5 text-neutral-600" />
          </button>
        </div>
      </div>

      <!-- Дни недели -->
      <div class="grid grid-cols-7 gap-2 mb-4">
        <div
          v-for="day in ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']"
          :key="day"
          class="p-3 text-center font-medium text-neutral-500 text-sm">
          {{ day }}
        </div>
      </div>

      <!-- Календарная сетка -->
      <div class="grid grid-cols-7 gap-2 mb-6">
        <button
          v-for="(day, index) in calendarDays"
          :key="index"
          @click="hasActivity(day) && setSelectedDate(day.toISOString().split('T')[0]!)"
          class="relative p-3 rounded-xl text-sm font-medium transition-all min-h-[60px]"
          :class="getDayClasses(day)"
          :disabled="!hasActivity(day)">
          <div class="flex flex-col items-center">
            <span>{{ day.getDate() }}</span>
            <div
              v-if="hasActivity(day)"
              class="flex items-center space-x-1 mt-1">
              <div
                :class="isToday(day) ? 'bg-white' : 'bg-emerald-600'"
                class="w-1.5 h-1.5 rounded-full" />
              <span
                :class="isToday(day) ? 'text-white' : 'text-emerald-700'"
                class="text-xs">
                {{ getCompletedTasksForDate(day).length }}
              </span>
            </div>
          </div>
        </button>
      </div>

      <!-- Легенда -->
      <div class="flex items-center justify-center space-x-8 text-sm text-neutral-600">
        <div class="flex items-center space-x-2">
          <div class="w-3 h-3 bg-neutral-900 rounded"></div>
          <span>Сегодня</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-3 h-3 bg-emerald-100 border border-emerald-200 rounded"></div>
          <span>Выполненные задачи</span>
        </div>
      </div>
    </div>

    <!-- Детали выбранного дня -->
    <div
      v-if="selectedDate"
      class="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-neutral-100">
      <div class="flex items-center justify-between mb-4 sm:mb-6">
        <h4 class="text-xl font-medium text-neutral-900">
          {{ new Date(selectedDate).toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" }) }}
        </h4>
        <button
          @click="selectedDate = null"
          class="p-2 hover:bg-neutral-100 rounded-xl transition-colors">
          <X class="w-4 h-4 text-neutral-600" />
        </button>
      </div>

      <div class="space-y-3 sm:space-y-4">
        <div
          v-for="(item, index) in completedHistory?.[selectedDate] || []"
          :key="index"
          class="flex items-center justify-between gap-4 p-4 bg-neutral-50 rounded-xl">
          <div class="flex items-center space-x-3">
            <div
              :class="getTaskIconClasses(item.type)"
              class="w-8 h-8 rounded-lg flex items-center justify-center">
              <component
                :is="getTaskIcon(item.type)"
                class="w-4 h-4"
                :class="getTaskIconColor(item.type)" />
            </div>
            <div>
              <p class="font-medium text-neutral-900">{{ item.text }}</p>
              <p class="text-xs text-neutral-500 font-light mt-1">{{ item.completedAt }}</p>
            </div>
          </div>
          <span class="text-sm font-medium text-neutral-600">+{{ item.points }}</span>
        </div>
      </div>

      <!-- Итоги дня -->
      <div class="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200">
        <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <span class="font-medium text-neutral-800">Итого за день:</span>
          <span class="font-medium text-emerald-700"> +{{ getDayTotalPoints() }} очков </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { ChevronLeft, ChevronRight, X, Trophy, CheckCircle, Star } from "lucide-vue-next";

import { getDateKey } from "@/utils/date";
import type { CompletedEntry, CompletedHistory, CompletionType } from "@/types/app";

const props = defineProps<{
  completedHistory: CompletedHistory | undefined;
}>();

const selectedDate = ref<string | null>(null);
const currentMonth = ref(new Date());

const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear();
  const month = currentMonth.value.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const days = [];
  for (let d = new Date(startDate); d <= lastDay || days.length % 7 !== 0; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }
  return days;
});

const today = computed(() => new Date());
const todayString = computed(() => today.value.toISOString().split("T")[0]);

const isToday = (day: Date) => day.toISOString().split("T")[0] === todayString.value;

const isCurrentMonth = (day: Date) => day.getMonth() === currentMonth.value.getMonth();

const hasActivity = (day: Date) => {
  const dateString = getDateKey(day);
  return (props.completedHistory?.[dateString] || []).length > 0;
};

const getDayClasses = (day: Date) => {
  if (isToday(day)) {
    return "bg-neutral-900 text-white";
  } else if (hasActivity(day)) {
    return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 cursor-pointer";
  } else if (isCurrentMonth(day)) {
    return "bg-neutral-50 text-neutral-400";
  } else {
    return "text-neutral-300";
  }
};

const getCompletedTasksForDate = (day: Date): CompletedEntry[] => {
  const dateString = getDateKey(day);
  return props.completedHistory?.[dateString] || [];
};

const navigateMonth = (direction: number) => {
  const newMonth = new Date(currentMonth.value);
  newMonth.setMonth(newMonth.getMonth() + direction);
  currentMonth.value = newMonth;
};

const setSelectedDate = (date: string) => {
  selectedDate.value = date;
};

const getTaskIcon = (type: CompletionType) => {
  switch (type) {
    case "habit":
      return Trophy;
    case "daily":
      return CheckCircle;
    case "weekly":
      return Star;
    case "monthly":
      return Star;
    default:
      return CheckCircle;
  }
};

const getTaskIconClasses = (type: CompletionType) => {
  switch (type) {
    case "habit":
      return "bg-blue-100";
    case "daily":
      return "bg-emerald-100";
    case "weekly":
      return "bg-purple-100";
    case "monthly":
      return "bg-orange-100";
    default:
      return "bg-neutral-200";
  }
};

const getTaskIconColor = (type: CompletionType) => {
  switch (type) {
    case "habit":
      return "text-blue-600";
    case "daily":
      return "text-emerald-600";
    case "weekly":
      return "text-purple-600";
    case "monthly":
      return "text-orange-600";
    default:
      return "text-neutral-500";
  }
};

const getDayTotalPoints = () => {
  if (!selectedDate.value) return 0;
  return (props.completedHistory?.[selectedDate.value!] || []).reduce((sum, item) => sum + item.points, 0);
};
</script>

<style scoped></style>
