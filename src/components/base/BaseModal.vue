<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
        @click.self="close">
        <div class="relative w-full max-w-xl rounded-3xl bg-white shadow-2xl">
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
