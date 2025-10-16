<template>
  <BaseModal
    v-model="isOpen"
    title="Импорт данных">
    <div class="space-y-5">
      <p class="text-sm text-neutral-600">
        Импорт принимает JSON, который формирует экспорт. Можно вставить текст прямо в поле ниже или загрузить файл.
        Если формат отличается, преобразуйте его заранее (например, с помощью AI).
      </p>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-neutral-800">Загрузить файл</label>
        <div class="flex items-center justify-between gap-3 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-3 text-sm">
          <div class="flex-1 truncate text-neutral-600">
            <span
              v-if="fileName"
              class="text-neutral-700">
              {{ fileName }}
            </span>
            <span
              v-else
              class="text-neutral-400">
              Файл не выбран
            </span>
          </div>
          <button
            type="button"
            class="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:border-neutral-400 hover:bg-white transition"
            @click="triggerFileSelect">
            Выбрать файл
          </button>
          <input
            ref="fileInput"
            type="file"
            accept="application/json,.json"
            class="hidden"
            @change="handleFileChange" />
        </div>
      </div>

      <div class="space-y-2">
        <label
          for="import-json"
          class="block text-sm font-medium text-neutral-800">
          Вставить JSON вручную
        </label>
        <textarea
          id="import-json"
          v-model="localValue"
          rows="10"
          class="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm font-mono text-neutral-800 shadow-sm focus:border-neutral-400 focus:outline-none"
          placeholder='{"week":1,"points":0,"habitDefinitions":{...}}'></textarea>
      </div>

      <p
        v-if="errorMessage"
        class="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
        {{ errorMessage }}
      </p>
    </div>

    <template #footer>
      <button
        type="button"
        class="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition"
        :disabled="isSubmitting"
        @click="close">
        Отмена
      </button>
      <button
        type="button"
        class="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
        :disabled="isSubmitting || !localValue.trim()"
        @click="submit">
        {{ isSubmitting ? "Импорт..." : "Импортировать" }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

import BaseModal from "@/components/base/BaseModal.vue";

const props = defineProps<{
  modelValue: boolean;
  isSubmitting?: boolean;
  error?: string | null;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [payload: string];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit("update:modelValue", value),
});

const localValue = ref("");
const fileName = ref<string>("");
const fileInput = ref<HTMLInputElement | null>(null);
const localError = ref<string | null>(null);

const errorMessage = computed(() => props.error ?? localError.value ?? null);

const resetState = () => {
  localValue.value = "";
  fileName.value = "";
  localError.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

watch(
  () => props.modelValue,
  isActive => {
    if (!isActive) {
      resetState();
    } else {
      localError.value = null;
    }
  }
);

const close = () => {
  if (props.isSubmitting) return;
  emit("update:modelValue", false);
};

const triggerFileSelect = () => {
  fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement | null;
  const file = input?.files?.[0];
  if (!file) return;

  const isJsonMime = file.type === "application/json" || file.type === "";
  const isJsonName = file.name.toLowerCase().endsWith(".json");

  if (!isJsonMime && !isJsonName) {
    localError.value = "Выберите JSON-файл, созданный экспортом.";
    localValue.value = "";
    fileName.value = "";
    if (input) input.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const text = typeof reader.result === "string" ? reader.result : "";
    localValue.value = text;
    fileName.value = file.name;
    localError.value = null;
    if (input) input.value = "";
  };
  reader.onerror = () => {
    localError.value = "Не удалось прочитать файл. Попробуйте снова.";
    localValue.value = "";
    fileName.value = "";
    if (input) input.value = "";
  };
  reader.readAsText(file);
};

const submit = () => {
  const trimmed = localValue.value.trim();
  if (!trimmed) {
    localError.value = "Вставьте JSON вручную или загрузите файл.";
    return;
  }
  localError.value = null;
  emit("confirm", trimmed);
};
</script>
