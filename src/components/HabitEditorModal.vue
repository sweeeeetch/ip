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
        <label class="block text-sm font-medium text-neutral-700">Иконка</label>
        <div class="grid grid-cols-[repeat(auto-fit,minmax(32px,64px))] gap-2 sm:gap-3">
          <button
            v-for="option in iconOptions"
            :key="option.value"
            type="button"
            role="radio"
            :aria-checked="form.icon === option.value"
            class="group relative flex aspect-square items-center justify-center rounded-xl border text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
            :class="form.icon === option.value ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 hover:border-neutral-400'"
            @click="form.icon = option.value"
            @keydown.enter.prevent="form.icon = option.value"
            @keydown.space.prevent="form.icon = option.value">
            <component
              :is="iconRegistry[option.value]"
              class="h-6 w-6" />
          </button>
        </div>
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-neutral-700">Период</label>
        <select
          v-model="form.time"
          class="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none">
          <option
            v-for="option in timeOptions"
            :key="option.value"
            :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-neutral-700">Цвет иконки</label>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="option in colorOptions"
            :key="option.value"
            type="button"
            class="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition"
            :class="form.color === option.value ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 hover:border-neutral-400'"
            @click="form.color = option.value">
            <span
              class="inline-block h-4 w-4 rounded-full"
              :class="option.swatch" />
            <span>{{ option.label }}</span>
          </button>
        </div>
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-neutral-700">Описание</label>
        <textarea
          v-model="form.desc"
          rows="3"
          class="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none" />
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-neutral-700">Очки</label>
        <input
          v-model.number="form.points"
          type="number"
          min="1"
          class="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none" />
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-neutral-700">Заметки</label>
        <textarea
          v-model="form.notes"
          rows="2"
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
        class="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
        @click="handleSubmit">
        Сохранить
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive, watch, computed } from "vue";

import BaseModal from "@/components/base/BaseModal.vue";
import { availableHabitIcons, habitIconRegistry } from "@/constants/icons";
import type { HabitDefinition, HabitIconName } from "@/types/app";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    habit?: HabitDefinition | null;
    mode?: "create" | "edit";
  }>(),
  {
    modelValue: false,
    habit: null,
    mode: "create",
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  save: [payload: { name: string; icon: HabitIconName; desc: string; points: number; notes?: string; time: HabitDefinition["time"]; color: string }];
}>();

const iconOptions = availableHabitIcons;
const iconRegistry = habitIconRegistry;
const timeOptions = [
  { label: "Утро", value: "morning" as HabitDefinition["time"] },
  { label: "День", value: "all-day" as HabitDefinition["time"] },
  { label: "Вечер", value: "evening" as HabitDefinition["time"] },
  { label: "Неделя", value: "weekend" as HabitDefinition["time"] },
];

const colorOptions = [
  { label: "Нейтральный", value: "text-neutral-600", swatch: "bg-neutral-500" },
  { label: "Синий", value: "text-sky-600", swatch: "bg-sky-500" },
  { label: "Бирюзовый", value: "text-cyan-500", swatch: "bg-cyan-500" },
  { label: "Зелёный", value: "text-emerald-500", swatch: "bg-emerald-500" },
  { label: "Жёлтый", value: "text-amber-500", swatch: "bg-amber-400" },
  { label: "Оранжевый", value: "text-orange-500", swatch: "bg-orange-500" },
  { label: "Розовый", value: "text-pink-500", swatch: "bg-pink-500" },
  { label: "Пурпурный", value: "text-purple-500", swatch: "bg-purple-500" },
  { label: "Фиолетовый", value: "text-indigo-600", swatch: "bg-indigo-500" },
  { label: "Красный", value: "text-red-500", swatch: "bg-red-500" },
];

const form = reactive({
  name: "",
  icon: iconOptions[0]?.value as HabitIconName,
  desc: "",
  points: 1,
  notes: "",
  time: "all-day" as HabitDefinition["time"],
  color: "text-neutral-600",
});

const mapTime = (time?: HabitDefinition["time"]) => {
  if (time === "flexible") return "all-day" as HabitDefinition["time"];
  if (time === "night") return "evening" as HabitDefinition["time"];
  return time ?? ("all-day" as HabitDefinition["time"]);
};

const resetForm = () => {
  form.name = props.habit?.name ?? "";
  form.icon = props.habit?.icon ?? iconOptions[0]!.value;
  form.desc = props.habit?.desc ?? "";
  form.points = props.habit?.points ?? 1;
  form.notes = props.habit?.notes ?? "";
  form.time = mapTime(props.habit?.time);
  form.color = props.habit?.color ?? "text-neutral-600";
};

watch(
  () => props.modelValue,
  open => {
    if (open) {
      resetForm();
    }
  }
);

const modalTitle = computed(() => (props.mode === "edit" ? "Редактировать привычку" : "Новая привычка"));

const handleSubmit = () => {
  if (!form.name.trim()) return;

  emit("save", {
    name: form.name.trim(),
    icon: form.icon,
    desc: form.desc.trim(),
    points: Math.max(1, Number(form.points) || 1),
    notes: form.notes.trim() || undefined,
    time: form.time,
    color: form.color,
  });
  emit("update:modelValue", false);
};
</script>
