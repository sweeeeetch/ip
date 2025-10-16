<template>
  <BaseModal
    :model-value="modelValue"
    :title="modalTitle"
    @update:model-value="emit('update:modelValue', $event)">
    <form
      class="space-y-5"
      @submit.prevent="handleSubmit">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-neutral-700">Название</label>
        <input
          v-model="form.name"
          type="text"
          required
          class="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none" />
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-neutral-700">Стоимость (в очках)</label>
        <input
          v-model.number="form.cost"
          type="number"
          min="1"
          class="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none" />
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-neutral-700">Дней до повторной доступности</label>
        <input
          v-model.number="form.resetDays"
          type="number"
          min="1"
          class="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none" />
      </div>
    </form>

    <template #footer>
      <button
        type="button"
        class="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100"
        @click="emit('update:modelValue', false)">
        Отмена
      </button>
      <button
        type="button"
        class="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
        @click="handleSubmit">
        Сохранить
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from "vue";

import BaseModal from "@/components/base/BaseModal.vue";
import type { Reward, RewardPayload } from "@/types/app";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    reward?: Reward | null;
    mode?: "create" | "edit";
  }>(),
  {
    modelValue: false,
    reward: null,
    mode: "create",
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  save: [payload: RewardPayload];
}>();

const form = reactive({
  name: "",
  cost: 10,
  resetDays: 1,
});

const resetForm = () => {
  form.name = props.reward?.name ?? "";
  form.cost = props.reward?.cost ?? 10;
  form.resetDays = props.reward?.resetDays ?? 1;
};

watch(
  () => props.modelValue,
  open => {
    if (open) {
      resetForm();
    }
  }
);

const modalTitle = computed(() => (props.mode === "edit" ? "Редактировать награду" : "Новая награда"));

const handleSubmit = () => {
  if (!form.name.trim()) return;

  const payload: RewardPayload = {
    name: form.name.trim(),
    cost: Math.max(1, Number(form.cost) || 1),
    resetDays: Math.max(1, Number(form.resetDays) || 1),
  };

  emit("save", payload);
  emit("update:modelValue", false);
};
</script>

<style scoped></style>
