<template>
  <ScreenRewards
    :points="points"
    :rewards="rewards"
    @claim-reward="claimReward" />
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

import ScreenRewards from "@/components/ScreenRewards.vue";
import { useAppStore } from "@/stores/appStore";

const store = useAppStore();
const { points, rewards } = storeToRefs(store);

const claimReward = (rewardId: number) => {
  store.claimReward(rewardId);
};
</script>
