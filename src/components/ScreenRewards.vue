<template>
  <div class="space-y-6 md:space-y-8">
    <div class="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-neutral-100">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8">
        <div>
          <h3 class="text-xl sm:text-2xl font-light text-neutral-900">Система наград</h3>
          <p class="text-sm sm:text-base text-neutral-600 font-light">Тратьте очки на приятные вещи</p>
        </div>
        <div class="text-left sm:text-right">
          <p class="text-2xl sm:text-3xl font-light text-neutral-900">{{ points }}</p>
          <p class="text-neutral-600 font-light">очков</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <div
          v-for="reward in rewards"
          :key="reward.id"
          @click="canClaim(reward) && claimReward(reward.id)"
          class="p-4 rounded-2xl border transition-all"
          :class="
            reward.claimed
              ? 'bg-emerald-50 border-emerald-200'
              : canClaim(reward)
              ? 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-md cursor-pointer'
              : 'bg-neutral-50 border-neutral-200 opacity-60'
          ">
          <div class="text-center">
            <div class="mb-3">
              <Award
                v-if="reward.claimed"
                class="w-8 h-8 text-emerald-500 mx-auto" />
              <Gift
                v-else
                :class="canClaim(reward) ? 'text-neutral-700' : 'text-neutral-400'"
                class="w-8 h-8 mx-auto" />
            </div>
            <h4 class="font-medium text-neutral-900 mb-2 text-sm leading-tight">{{ reward.name }}</h4>
            <p
              :class="reward.claimed ? 'text-emerald-600' : canClaim(reward) ? 'text-neutral-600' : 'text-red-500'"
              class="font-light text-xs mb-2">
              {{ reward.claimed ? "Получено!" : canClaim(reward) ? `${reward.cost} очков` : `Нужно ${reward.cost} очков` }}
            </p>
            <p
              v-if="reward.claimed"
              class="text-xs text-neutral-500">
              Через {{ reward.resetDays }} {{ reward.resetDays === 1 ? "день" : "дней" }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Gift, Award } from "lucide-vue-next";

import type { Reward } from "@/types/app";

const props = defineProps<{
  points: number;
  rewards: Reward[];
}>();

const emit = defineEmits<{
  claimReward: [rewardId: number];
}>();

const canClaim = (reward: Reward) => props.points >= reward.cost && !reward.claimed;

const claimReward = (rewardId: number) => {
  emit("claimReward", rewardId);
};
</script>

<style scoped></style>
