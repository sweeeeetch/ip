<template>
  <ScreenCalendar :completed-history="completedHistory" />
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

import ScreenCalendar from "@/components/ScreenCalendar.vue";
import { useAppStore } from "@/stores/appStore";

const store = useAppStore();
const { completedHistory } = storeToRefs(store);
</script>
