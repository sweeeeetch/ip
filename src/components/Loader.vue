<script setup lang="ts">
interface LoaderProps {
  size?: number;
  margin?: number;
  color?: string;
}

withDefaults(defineProps<LoaderProps>(), {
  size: 20,
  margin: 4,
  color: "#00a6f4",
});
</script>

<template>
  <div>
    <div
      v-for="item in 3"
      :style="{
        animation: `pulsee 0.75s ${item * 0.12}s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08)`,
        width: `${size}px`,
        height: `${size}px`,
        margin: `${margin}px`,
        backgroundColor: color,
      }"
      class="inline-block rounded-full"></div>
  </div>
</template>

<style>
@keyframes pulsee {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  45% {
    transform: scale(0.1);
    opacity: 0.7;
  }

  80% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
