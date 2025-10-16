<template>
  <ScreenTrackers
    :mood="mood"
    :gratitude="gratitude"
    :financial-bonuses="financialBonuses"
    @update-mood="updateMood"
    @add-gratitude="addGratitude"
    @add-financial-bonus="addFinancialBonus"
    @delete-gratitude="deleteGratitude" />
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

import ScreenTrackers from "@/components/ScreenTrackers.vue";
import { useAppStore } from "@/stores/appStore";
import type { GratitudeEntry } from "@/types/app";

const store = useAppStore();
const { mood, gratitude } = storeToRefs(store);
const financialBonuses = store.financialBonuses;

const updateMood = (value: number) => {
  store.updateMood(value);
};

const addGratitude = (entry: GratitudeEntry) => {
  store.addGratitude(entry);
};

const addFinancialBonus = (bonusId: number) => {
  store.addFinancialBonus(bonusId);
};

const deleteGratitude = (entryId: number) => {
  store.deleteGratitude(entryId);
};
</script>
