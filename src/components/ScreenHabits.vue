<template>
  <div class="space-y-6 md:space-y-8">
    <!-- Прогресс и уровень -->
    <div class="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-neutral-100">
      <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-6 md:mb-8">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl flex items-center justify-center text-white font-light text-2xl">
            {{ level }}
          </div>
          <div class="text-left">
            <h2 class="text-2xl md:text-3xl font-light text-neutral-900">Уровень {{ level }}</h2>
            <p class="text-sm sm:text-base text-neutral-600 font-light">{{ points }} очков • {{ getPointsForNextLevel() }} до следующего уровня</p>
          </div>
        </div>
        <div class="flex flex-col items-center gap-2 sm:flex-row sm:gap-6">
          <div class="text-center">
            <RotateCcw class="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <p class="text-xs text-neutral-500 font-medium">Сброс через</p>
            <p class="text-xs text-neutral-700 font-medium">{{ getTimeUntilReset() }}</p>
          </div>
        </div>
      </div>

      <div>
        <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-3">
          <span class="text-sm font-medium text-neutral-600">Недельный прогресс</span>
          <span class="text-sm font-medium text-neutral-600">{{ points }} / {{ maxPoints }}</span>
        </div>
        <div class="w-full bg-neutral-100 rounded-full h-2">
          <div
            class="bg-gradient-to-r from-neutral-600 to-neutral-800 h-2 rounded-full transition-all duration-700"
            :style="{ width: `${weekProgress}%` }" />
        </div>
      </div>
    </div>

    <!-- Привычки по категориям -->
    <div class="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-neutral-100">
      <div class="mb-6 md:mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h3 class="text-xl sm:text-2xl font-light text-neutral-900">Ежедневные привычки</h3>
        <button
          class="flex items-center gap-2 rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-100"
          @click="openCreateModal">
          <Plus class="h-4 w-4" />
          Добавить привычку
        </button>
      </div>

      <!-- Утренние -->
      <div class="mb-10">
        <h4 class="text-lg font-medium text-neutral-800 mb-6 flex items-center">
          <span class="text-2xl mr-3">🌅</span>
          Утренние привычки
        </h4>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <HabitCard
            v-for="[key, habit] in morningHabits"
            :key="key"
            :habit-key="key"
            :habit="habit"
            :is-active="!!habits[key]"
            :streak="streaks[key]?.count || 0"
            editable
            @toggle="handleToggleHabit"
            @edit="handleEditHabit"
            @delete="handleDeleteHabit" />
        </div>
      </div>

      <!-- В течение дня -->
      <div class="mb-10">
        <h4 class="text-lg font-medium text-neutral-800 mb-6 flex items-center">
          <span class="text-2xl mr-3">⏰</span>
          В течение дня
        </h4>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <HabitCard
            v-for="[key, habit] in dayHabits"
            :key="key"
            :habit-key="key"
            :habit="habit"
            :is-active="habits[key] || false"
            :streak="streaks[key]?.count || 0"
            editable
            @toggle="handleToggleHabit"
            @edit="handleEditHabit"
            @delete="handleDeleteHabit" />
        </div>
      </div>

      <!-- Вечерние -->
      <div class="mb-10">
        <h4 class="text-lg font-medium text-neutral-800 mb-6 flex items-center">
          <span class="text-2xl mr-3">🌙</span>
          Вечерние привычки
        </h4>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <HabitCard
            v-for="[key, habit] in eveningHabits"
            :key="key"
            :habit-key="key"
            :habit="habit"
            :is-active="habits[key] || false"
            :streak="streaks[key]?.count || 0"
            editable
            @toggle="handleToggleHabit"
            @edit="handleEditHabit"
            @delete="handleDeleteHabit" />
        </div>
      </div>

      <!-- Недельные -->
      <div>
        <h4 class="text-lg font-medium text-neutral-800 mb-6 flex items-center">
          <span class="text-2xl mr-3">🏖️</span>
          Недельные задачи
        </h4>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <HabitCard
            v-for="[key, habit] in weekendHabits"
            :key="key"
            :habit-key="key"
            :habit="habit"
            :is-active="!!habits[key]"
            :streak="streaks[key]?.count || 0"
            editable
            @toggle="handleToggleHabit"
            @edit="handleEditHabit"
            @delete="handleDeleteHabit" />
        </div>
      </div>
    </div>
    <HabitEditorModal
      v-model="showHabitModal"
      :habit="modalHabit"
      :mode="modalMode"
      @save="handleSaveHabit" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { RotateCcw, Plus } from "lucide-vue-next";
import HabitCard from "./HabitCard.vue";
import HabitEditorModal from "@/components/HabitEditorModal.vue";

import type { HabitDefinition, HabitState, HabitTime, StreakMap } from "@/types/app";

const props = defineProps<{
  level: number;
  points: number;
  maxPoints: number;
  weekProgress: number;
  pointsToNextLevel: number;
  timeUntilReset: string;
  habits: HabitState;
  streaks: StreakMap;
  habitDefinitions: Record<string, HabitDefinition>;
}>();

const emit = defineEmits<{
  toggleHabit: [habitKey: string];
  createHabit: [
    payload: { name: string; icon: HabitDefinition["icon"]; desc: string; points: number; notes?: string; time: HabitTime; color: string },
  ];
  updateHabit: [
    habitKey: string,
    payload: {
      name: string;
      icon: HabitDefinition["icon"];
      desc: string;
      points: number;
      notes?: string;
      time: HabitTime;
      color: string;
    },
  ];
  deleteHabit: [habitKey: string];
}>();

const morningHabits = computed(() => Object.entries(props.habitDefinitions).filter(([, habit]) => habit.time === "morning"));

const dayHabits = computed(() =>
  Object.entries(props.habitDefinitions).filter(([, habit]) => habit.time === "flexible" || habit.time === "all-day")
);

const eveningHabits = computed(() =>
  Object.entries(props.habitDefinitions).filter(([, habit]) => habit.time === "evening" || habit.time === "night")
);

const weekendHabits = computed(() => Object.entries(props.habitDefinitions).filter(([, habit]) => habit.time === "weekend"));

const getPointsForNextLevel = () => props.pointsToNextLevel;

const getTimeUntilReset = () => props.timeUntilReset;

const handleToggleHabit = (habitKey: string) => {
  emit("toggleHabit", habitKey);
};

const showHabitModal = ref(false);
const modalMode = ref<"create" | "edit">("create");
const editingHabitId = ref<string | null>(null);

const modalHabit = computed(() => {
  if (modalMode.value === "edit" && editingHabitId.value) {
    return props.habitDefinitions[editingHabitId.value] ?? null;
  }
  return null;
});

const openCreateModal = () => {
  modalMode.value = "create";
  editingHabitId.value = null;
  showHabitModal.value = true;
};

const handleEditHabit = (habitKey: string) => {
  const habit = props.habitDefinitions[habitKey];
  if (!habit) return;
  modalMode.value = "edit";
  editingHabitId.value = habitKey;
  showHabitModal.value = true;
};

const handleDeleteHabit = (habitKey: string) => {
  if (!props.habitDefinitions[habitKey]) return;
  const confirmed = window.confirm("Удалить привычку?");
  if (confirmed) {
    emit("deleteHabit", habitKey);
  }
};

const handleSaveHabit = (payload: {
  name: string;
  icon: HabitDefinition["icon"];
  desc: string;
  points: number;
  notes?: string;
  time: HabitTime;
  color: string;
}) => {
  if (modalMode.value === "edit" && editingHabitId.value) {
    emit("updateHabit", editingHabitId.value, payload);
  } else {
    emit("createHabit", payload);
  }
};
</script>

<style scoped></style>
