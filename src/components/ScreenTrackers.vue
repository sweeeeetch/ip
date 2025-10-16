<template>
  <div class="space-y-6 md:space-y-8">
    <!-- Настроение -->
    <div class="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-neutral-100">
      <h3 class="text-lg sm:text-xl font-medium text-neutral-900 mb-4 sm:mb-6 flex items-center">
        <Smile class="w-6 h-6 mr-3 text-yellow-500" />
        Настроение сегодня
      </h3>
      <div class="flex items-center space-x-4 mb-4">
        <span class="text-sm text-neutral-600">Ужасно</span>
        <input
          v-model.number="mood"
          type="range"
          min="1"
          max="10"
          class="flex-1" />
        <span class="text-sm text-neutral-600">Отлично</span>
      </div>
      <div class="text-center">
        <span class="text-3xl font-light text-neutral-900">{{ mood }}/10</span>
        <p class="text-sm text-neutral-600 mt-1">
          {{ mood <= 3 ? "Трудный день" : mood <= 6 ? "Нормально" : mood <= 8 ? "Хорошо" : "Превосходно" }}
        </p>
      </div>
    </div>

    <!-- Журнал благодарностей -->
    <div class="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-neutral-100">
      <h3 class="text-lg sm:text-xl font-medium text-neutral-900 mb-4 sm:mb-6 flex items-center">
        <Heart class="w-6 h-6 mr-3 text-pink-500" />
        Благодарности
      </h3>
      <div class="flex gap-4 mb-6">
        <input
          v-model="newGratitude"
          type="text"
          placeholder="За что вы благодарны сегодня?"
          class="flex-1 p-3 border border-neutral-200 rounded-xl focus:border-neutral-400 focus:outline-none text-sm font-light placeholder-neutral-400"
          @keypress.enter="addGratitude" />
        <button
          @click="addGratitude"
          class="bg-pink-500 text-white px-4 py-3 rounded-xl hover:bg-pink-600 transition-colors">
          <Plus class="w-4 h-4" />
        </button>
      </div>
      <div class="space-y-2 max-h-48 overflow-y-auto">
        <div
          v-for="item in gratitude.slice(-5).reverse()"
          :key="item.id"
          class="bg-pink-50 rounded-lg p-3">
          <div class="flex items-start justify-between gap-3">
            <p class="text-sm text-neutral-700">{{ item.text }}</p>
            <button
              type="button"
              class="rounded-full p-1.5 text-pink-400 transition hover:bg-pink-100/70 hover:text-pink-500"
              @click="deleteGratitude(item.id)">
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
          <p class="text-xs text-neutral-500 mt-1">{{ item.date }}</p>
        </div>
      </div>
    </div>

    <div class="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-3xl p-6 md:p-8 text-white">
      <h3 class="text-lg sm:text-xl font-medium mb-2 flex items-center">
        <DollarSign class="w-6 h-6 mr-3" />
        Финансовые достижения
      </h3>
      <p class="text-emerald-100 font-light mb-6">Отмечайте доходы и успехи</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          v-for="bonus in financialBonuses"
          :key="bonus.id"
          @click="addFinancialBonus(bonus.id)"
          class="bg-white/10 border border-white border-opacity-20 rounded-xl p-4 text-left hover:bg-opacity-20 transition-all active:scale-95">
          <h4 class="font-medium mb-1">{{ bonus.name }}</h4>
          <p class="text-emerald-100 text-sm font-light mb-2">{{ bonus.desc }}</p>
          <p class="text-white font-medium text-sm">+{{ bonus.points }} очков</p>
        </button>
      </div>

      <!-- Toast feedback -->
      <Teleport to="body">
        <div class="fixed top-24 sm:top-10 left-1/2 -translate-x-1/2 z-50">
          <Transition name="toast">
            <div
              v-if="bonusToast"
              class="flex items-center gap-3 rounded-2xl bg-white shadow-xl border border-neutral-200 px-4 py-3">
              <div class="relative flex justify-center items-center w-4 h-4">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
              </div>
              <div>
                <p class="text-sm font-medium text-neutral-900">{{ bonusToast.title }}</p>
                <p class="text-xs text-neutral-600">{{ bonusToast.subtitle }}</p>
              </div>
            </div>
          </Transition>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Smile, Heart, Plus, DollarSign, Trash2 } from "lucide-vue-next";

import type { FinancialBonus, GratitudeEntry } from "@/types/app";

const props = defineProps<{
  mood: number;
  gratitude: GratitudeEntry[];
  financialBonuses: FinancialBonus[];
}>();

const emit = defineEmits<{
  updateMood: [mood: number];
  addGratitude: [gratitude: GratitudeEntry];
  addFinancialBonus: [bonusId: number];
  deleteGratitude: [gratitudeId: number];
}>();

const newGratitude = ref("");
const bonusToast = ref<{ title: string; subtitle: string } | null>(null);
let toastTimer: number | undefined;

const mood = computed({
  get: () => props.mood,
  set: (value: number) => emit("updateMood", value),
});

const addGratitude = () => {
  if (!newGratitude.value.trim()) return;

  const gratitudeItem: GratitudeEntry = {
    id: Date.now(),
    text: newGratitude.value.trim(),
    date: new Date().toDateString(),
  };

  emit("addGratitude", gratitudeItem);
  newGratitude.value = "";
};

const addFinancialBonus = (bonusId: number) => {
  emit("addFinancialBonus", bonusId);

  // Find bonus to show feedback
  const bonus = props.financialBonuses.find(b => b.id === bonusId);
  if (bonus) {
    bonusToast.value = {
      title: `💰 ${bonus.name}`,
      subtitle: `+${bonus.points} очков добавлено`,
    };

    // Clear previous timer if any
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      bonusToast.value = null;
      toastTimer = undefined;
    }, 1800);
  }
};

const deleteGratitude = (entryId: number) => {
  emit("deleteGratitude", entryId);
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
</style>
