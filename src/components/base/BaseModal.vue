<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[99999] flex items-center justify-center px-4">
        <div
          class="absolute inset-0 bg-black/40 backdrop-blur-sm"
          @click="close"></div>
        <div class="relative z-10 w-full max-w-xl rounded-3xl bg-white shadow-2xl">
          <header class="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
            <h3 class="text-lg font-medium text-neutral-900">{{ title }}</h3>
            <button
              class="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100"
              @click="close">
              <X class="h-4 w-4" />
            </button>
          </header>
          <section class="max-h-[70vh] overflow-y-auto px-6 py-4">
            <slot />
          </section>
          <footer
            v-if="$slots.footer"
            class="flex justify-end gap-3 border-t border-neutral-200 px-6 py-4">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from "lucide-vue-next";
import { onBeforeUnmount, watch } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title: string;
  }>(),
  {
    modelValue: false,
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const close = () => {
  emit("update:modelValue", false);
};

const body = typeof document !== "undefined" ? document.body : null;
// Store bookkeeping values on body.dataset so multiple modals play nicely together.
const LOCK_COUNT_KEY = "modalLockCount";
const ORIGINAL_OVERFLOW_KEY = "modalOriginalOverflow";

const lockScroll = () => {
  if (!body) return;
  const current = Number(body.dataset[LOCK_COUNT_KEY] ?? "0");
  if (current === 0) {
    body.dataset[ORIGINAL_OVERFLOW_KEY] = body.style.overflow || "";
    body.style.overflow = "hidden";
  }
  body.dataset[LOCK_COUNT_KEY] = String(current + 1);
};

const unlockScroll = () => {
  if (!body || !body.dataset[LOCK_COUNT_KEY]) return;
  const current = Number(body.dataset[LOCK_COUNT_KEY] ?? "0");
  if (current <= 1) {
    const original = body.dataset[ORIGINAL_OVERFLOW_KEY] ?? "";
    if (original) {
      body.style.overflow = original;
    } else {
      body.style.removeProperty("overflow");
    }
    delete body.dataset[LOCK_COUNT_KEY];
    delete body.dataset[ORIGINAL_OVERFLOW_KEY];
  } else {
    body.dataset[LOCK_COUNT_KEY] = String(current - 1);
  }
};

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      lockScroll();
    } else {
      unlockScroll();
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  unlockScroll();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
