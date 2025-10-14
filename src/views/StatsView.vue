<template>
  <ScreenStats
    :level="level"
    :points="points"
    :total-points="totalPoints"
    :week="week"
    :habits="habits"
    :mood="mood"
    :streaks="streaks"
    :habit-definitions="habitDefinitions"
    :achievements="achievements"
    :points-to-next-level="pointsToNextLevel"
    :completed-habits-count="completedHabitsCount"
    :active-goals-count="activeGoalsCount"
    :time-until-reset="timeUntilReset"
    :top-streaks="topStreaks"
    @export-data="exportData" />
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

import ScreenStats from "@/components/ScreenStats.vue";
import { useAppStore } from "@/stores/appStore";

const store = useAppStore();
const {
  level,
  points,
  totalPoints,
  week,
  habits,
  mood,
  streaks,
  habitDefinitions,
  achievements,
  pointsToNextLevel,
  completedHabitsCount,
  activeGoalsCount,
  timeUntilReset,
  topStreaks,
} = storeToRefs(store);

const exportData = () => {
  const snapshot = store.createExportSnapshot();
  const dataStr = JSON.stringify(snapshot, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `ip-system-backup-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
</script>
