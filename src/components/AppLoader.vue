<script setup lang="ts">
import Loader from "@/components/Loader.vue";
import InteractiveEye from "@/components/InteractiveEye.vue";
</script>

<template>
  <div class="absolute bottom-0 left-0 right-0 top-0 z-50 bg-white">
    <div class="absolute left-1/2 top-[15%] w-full -translate-x-1/2 transform">
      <div class="absolute left-1/2 mt-16 -translate-x-1/2 z-10 transform">
        <div class="flex flex-col items-center gap-3 text-center md:flex-row md:items-center md:justify-between md:text-left mb-6 md:mb-10 lg:mb-12">
          <div class="flex items-center justify-center space-x-2 md:space-x-4">
            <InteractiveEye />
            <h1 class="text-4xl sm:text-5xl md:text-6xl font-extralight text-neutral-900 tracking-tight">i.p</h1>
          </div>
          <p class="text-base text-neutral-600 font-light tracking-wide md:max-w-xs md:text-right">Система личной эффективности</p>
        </div>
      </div>

      <Loader
        class="absolute -bottom-[420px] left-1/2 -translate-x-1/2 transform"
        :size="32" />
    </div>
  </div>
</template>

<style scoped>
.shadow-text {
  text-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1), 0 4px 4px 0 rgba(0, 0, 0, 0.09), 0 9px 5px 0 rgba(0, 0, 0, 0.05), 0 16px 6px 0 rgba(0, 0, 0, 0.01), 0 25px 7px 0 rgba(0, 0, 0, 0);
}

.draw path {
  fill: none;
  stroke: #444;
  stroke-width: 2;
  stroke-linecap: round;
  animation: revealPause 6s linear infinite both; /* total cycle = 6s */
}

@keyframes revealPause {
  /* draw (0%→50%) */
  0% {
    stroke-dashoffset: var(--len, 1);
  }
  50% {
    stroke-dashoffset: 0;
  }

  /* pause fully drawn (50%→70%) */
  70% {
    stroke-dashoffset: 0;
  }

  /* jump back (70%→100%) — stays reset */
  100% {
    stroke-dashoffset: var(--len, 1);
  }
}

.logo-spin {
  animation: spin 5s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
