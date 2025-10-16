<template>
  <ScreenRewards
    :points="points"
    :rewards="rewards"
    @claim-reward="claimReward"
    @create-reward="createReward"
    @update-reward="updateReward"
    @delete-reward="deleteReward" />
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

import ScreenRewards from "@/components/ScreenRewards.vue";
import { useAppStore } from "@/stores/appStore";
import type { RewardPayload } from "@/types/app";

const store = useAppStore();
const { points, rewards } = storeToRefs(store);

const claimReward = (rewardId: number) => {
  store.claimReward(rewardId);
};

const createReward = (payload: RewardPayload) => {
  store.addReward(payload);
};

const updateReward = (rewardId: number, payload: RewardPayload) => {
  store.updateReward(rewardId, payload);
};

const deleteReward = (rewardId: number) => {
  store.deleteReward(rewardId);
};
</script>
