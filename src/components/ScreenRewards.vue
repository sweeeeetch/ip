<template>
  <div class="space-y-6 md:space-y-8">
    <div class="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-neutral-100">
      <div class="flex gap-4 items-center justify-between mb-2">
        <div>
          <h3 class="text-xl sm:text-2xl font-light text-neutral-900">Система наград</h3>
          <p class="text-sm sm:text-base text-neutral-600 font-light">Тратьте очки на приятные вещи</p>
        </div>
        <div class="text-left sm:text-right">
          <p class="text-2xl sm:text-3xl font-light text-neutral-900">{{ points }}</p>
          <p class="text-neutral-600 font-light">очков</p>
        </div>
      </div>
      <div
        class="flex flex-col sm:flex-row sm:items-end gap-3 mb-6 md:mb-8"
        :class="[isEditing ? 'justify-between' : 'justify-end']">
        <div class="flex w-full sm:justify-end justify-center items-center gap-2 sm:gap-3">
          <button
            type="button"
            class="flex items-center w-full justify-center sm:w-fit gap-2 rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
            @click="openCreateModal">
            <Plus class="h-4 w-4" />
            Добавить
          </button>
          <button
            type="button"
            class="flex items-center w-full justify-center sm:w-fit gap-2 rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50"
            @click="toggleEditMode">
            <Check
              v-if="isEditing"
              class="h-4 w-4" />
            <PencilLine
              v-else
              class="h-4 w-4" />
            {{ isEditing ? "Готово" : "Изменить" }}
          </button>
        </div>
        <p
          v-if="isEditing"
          class="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
          <PencilLine class="h-3 w-3" />
          Режим редактирования включен
        </p>
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        <div
          v-for="reward in rewards"
          :key="reward.id"
          class="relative rounded-2xl border p-4 transition-all"
          :class="cardClasses(reward)"
          @click="handleRewardClick(reward)">
          <button
            v-if="isEditing"
            type="button"
            class="absolute right-3 top-3 rounded-full p-1.5 text-neutral-500 transition hover:bg-red-50 hover:text-red-600"
            @click.stop="handleDeleteClick(reward.id)">
            <Trash2 class="h-4 w-4" />
          </button>
          <div class="text-center">
            <div class="mb-3">
              <Award
                v-if="reward.claimed"
                class="mx-auto h-8 w-8 text-emerald-500" />
              <Gift
                v-else
                :class="canClaim(reward) ? 'text-neutral-700' : 'text-neutral-400'"
                class="mx-auto h-8 w-8" />
            </div>
            <h4 class="mb-2 text-sm font-medium leading-tight text-neutral-900">{{ reward.name }}</h4>
            <p
              :class="reward.claimed ? 'text-emerald-600' : canClaim(reward) ? 'text-neutral-600' : 'text-red-500'"
              class="mb-2 text-xs font-light">
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

  <RewardEditorModal
    v-model="isEditorOpen"
    :mode="editorMode"
    :reward="activeReward"
    @save="handleSave" />
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Award, Gift, Plus, PencilLine, Trash2, Check } from "lucide-vue-next";

import RewardEditorModal from "@/components/RewardEditorModal.vue";
import type { Reward, RewardPayload } from "@/types/app";

const props = defineProps<{
  points: number;
  rewards: Reward[];
}>();

const emit = defineEmits<{
  claimReward: [rewardId: number];
  createReward: [payload: RewardPayload];
  updateReward: [rewardId: number, payload: RewardPayload];
  deleteReward: [rewardId: number];
}>();

const canClaim = (reward: Reward) => props.points >= reward.cost && !reward.claimed;

const isEditing = ref(false);
const isEditorOpen = ref(false);
const editorMode = ref<"create" | "edit">("create");
const activeReward = ref<Reward | null>(null);

const cardClasses = (reward: Reward) => {
  if (reward.claimed) {
    return isEditing.value ? "bg-emerald-50 border-emerald-200 cursor-pointer hover:border-emerald-300 hover:shadow-md" : "bg-emerald-50 border-emerald-200";
  }
  if (isEditing.value) {
    return "bg-white border-neutral-200 cursor-pointer hover:border-neutral-300 hover:shadow-md";
  }
  if (canClaim(reward)) {
    return "bg-white border-neutral-200 cursor-pointer hover:border-neutral-300 hover:shadow-md";
  }
  return "bg-neutral-50 border-neutral-200 opacity-60";
};

const toggleEditMode = () => {
  isEditing.value = !isEditing.value;
  if (!isEditing.value) {
    activeReward.value = null;
  }
};

const openCreateModal = () => {
  editorMode.value = "create";
  activeReward.value = null;
  isEditorOpen.value = true;
};

const openEditModal = (reward: Reward) => {
  editorMode.value = "edit";
  activeReward.value = reward;
  isEditorOpen.value = true;
};

const handleRewardClick = (reward: Reward) => {
  if (isEditing.value) {
    openEditModal(reward);
    return;
  }
  if (canClaim(reward)) {
    emit("claimReward", reward.id);
  }
};

const handleSave = (payload: RewardPayload) => {
  if (editorMode.value === "create") {
    emit("createReward", payload);
  } else if (activeReward.value) {
    emit("updateReward", activeReward.value.id, payload);
  }
};

const handleDeleteClick = (rewardId: number) => {
  emit("deleteReward", rewardId);
};

watch(isEditorOpen, open => {
  if (!open) {
    activeReward.value = null;
    editorMode.value = "create";
  }
});
</script>

<style scoped></style>
