<template>
  <ScreenPlanning
    :week-plan="weekPlan"
    @update-week-plan="updateWeekPlan" />
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

import ScreenPlanning from "@/components/ScreenPlanning.vue";
import { useAppStore } from "@/stores/appStore";

const store = useAppStore();
const { weekPlan } = storeToRefs(store);

const updateWeekPlan = (plan: Record<string, string>) => {
  store.updateWeekPlan(plan);
};
</script>
