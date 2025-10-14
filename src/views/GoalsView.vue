<template>
  <ScreenGoals
    :daily-tasks="dailyTasks"
    :weekly-goals="weeklyGoals"
    :monthly-projects="monthlyProjects"
    @add-task="addTask"
    @toggle-task="toggleTask"
    @update-task="updateTask"
    @delete-task="deleteTask" />
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

import ScreenGoals from "@/components/ScreenGoals.vue";
import { useAppStore } from "@/stores/appStore";
import type { TaskType } from "@/types/app";

const store = useAppStore();
const { dailyTasks, weeklyGoals, monthlyProjects } = storeToRefs(store);

const addTask = (payload: { text: string; priority: number; type: TaskType }) => {
  store.createTask(payload);
};

const toggleTask = (taskId: number, taskType: TaskType) => {
  store.toggleTask(taskId, taskType);
};

const updateTask = (taskId: number, taskType: TaskType, text: string) => {
  store.updateTaskText(taskId, taskType, text);
};

const deleteTask = (taskId: number, taskType: TaskType) => {
  store.deleteTask(taskId, taskType);
};
</script>
