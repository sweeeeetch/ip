<template>
  <ScreenHabits
    :level="level"
    :points="points"
    :max-points="maxPoints"
    :week-progress="weekProgress"
    :points-to-next-level="pointsToNextLevel"
    :time-until-reset="timeUntilReset"
    :habits="habits"
    :streaks="streaks"
    :habit-definitions="habitDefinitions"
    @toggle-habit="toggleHabit"
    @create-habit="createHabit"
    @update-habit="updateHabit"
    @delete-habit="deleteHabit" />
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

import ScreenHabits from "@/components/ScreenHabits.vue";
import { useAppStore } from "@/stores/appStore";
import type { HabitIconName, HabitTime } from "@/types/app";

const store = useAppStore();
const {
  level,
  points,
  weekProgress,
  pointsToNextLevel,
  timeUntilReset,
  habits,
  streaks,
  habitDefinitions,
} = storeToRefs(store);

const maxPoints = store.maxPoints;

const toggleHabit = (habitKey: string) => {
  store.toggleHabit(habitKey);
};

const createHabit = (payload: {
  name: string;
  icon: HabitIconName;
  desc: string;
  points: number;
  notes?: string;
  time: HabitTime;
  color: string;
}) => {
  store.upsertHabitDefinition(null, payload);
};

const updateHabit = (
  habitKey: string,
  payload: {
    name: string;
    icon: HabitIconName;
    desc: string;
    points: number;
    notes?: string;
    time: HabitTime;
    color: string;
  }
) => {
  store.upsertHabitDefinition(habitKey, payload);
};

const deleteHabit = (habitKey: string) => {
  store.deleteHabitDefinition(habitKey);
};
</script>
