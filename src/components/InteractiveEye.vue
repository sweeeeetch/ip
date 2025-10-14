<template>
  <div
    ref="eyeRef"
    class="w-12 h-12 md:w-16 md:h-16 bg-neutral-900 rounded-full flex items-center justify-center shadow-sm relative border border-neutral-800">
    <div class="w-8 h-8 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center relative overflow-hidden">
      <div
        class="w-5 h-5 md:w-7 md:h-7 rounded-full flex items-center justify-center transition-transform duration-100 ease-out"
        :style="{
          background: 'radial-gradient(circle, #171717 40%, #0a0a0a 70%, #000000 100%)',
          transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
        }">
        <div class="w-2 h-2 md:w-3 md:h-3 bg-sky-500 rounded-full relative">
          <div class="w-0.5 h-0.5 md:w-1 md:h-1 bg-white rounded-full absolute top-0.5 left-0.5 opacity-60"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps<{
  scale?: number;
}>();

const mousePos = ref({ x: 0, y: 0 });
const eyeRef = ref<HTMLElement | null>(null);

onMounted(() => {
  const handleMouseMove = (e: MouseEvent) => {
    if (eyeRef.value) {
      const rect = eyeRef.value.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
      const distance = Math.min(Math.hypot(e.clientX - eyeCenterX, e.clientY - eyeCenterY) / 150, 1);

      mousePos.value = {
        x: Math.cos(angle) * distance * 4 * (props.scale || 1),
        y: Math.sin(angle) * distance * 4 * (props.scale || 1),
      };
    }
  };

  window.addEventListener("mousemove", handleMouseMove);

  onUnmounted(() => {
    window.removeEventListener("mousemove", handleMouseMove);
  });
});
</script>

<style scoped></style>
