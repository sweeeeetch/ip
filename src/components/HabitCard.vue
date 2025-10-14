<template>
  <div
    @click="toggleHabit"
    class="group relative p-5 rounded-2xl cursor-pointer transition-all duration-300 border"
    :class="isActive ? 'bg-neutral-900 text-white border-neutral-800 shadow-xl' : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-sm hover:shadow-md'">
    <div
      v-if="editable"
      class="absolute top-3 right-3 flex items-center space-x-1">
      <button
        class="p-1 rounded-full transition-colors"
        :class="isActive ? 'hover:bg-white/10' : 'hover:bg-neutral-100'"
        @click.stop="handleEdit">
        <Pencil class="w-4 h-4" />
      </button>
      <button
        class="p-1 rounded-full transition-colors"
        :class="isActive ? 'hover:bg-white/10' : 'hover:bg-neutral-100'"
        @click.stop="handleDelete">
        <Trash class="w-4 h-4" />
      </button>
    </div>

    <div class="flex items-start space-x-4">
      <div
        class="flex-shrink-0 p-2 rounded-xl"
        :class="isActive ? 'bg-white/10' : 'bg-neutral-50'">
        <component
          :is="iconComponent"
          class="w-6 h-6"
          :class="[isActive ? 'text-white' : habit.color]" />
      </div>
      <div class="flex-1 min-w-0">
        <h4
          class="font-medium text-base leading-tight mb-1"
          :class="isActive ? 'text-white' : 'text-neutral-900'">
          {{ habit.name }}
        </h4>
        <p
          class="text-sm leading-relaxed mb-2"
          :class="isActive ? 'text-neutral-300' : 'text-neutral-600'">
          {{ habit.desc }}
        </p>
        <p
          v-if="habit.notes"
          class="text-xs italic mb-2"
          :class="isActive ? 'text-neutral-300' : 'text-neutral-500'">
          {{ habit.notes }}
        </p>
        <div class="flex items-center justify-between">
          <span
            class="text-sm font-medium"
            :class="isActive ? 'text-neutral-400' : 'text-neutral-500'">
            {{ habit.points }} {{ habit.points === 1 ? "очко" : habit.points < 5 ? "очка" : "очков" }}
          </span>
          <div class="flex items-center gap-1">
            <template v-if="!isActive && streak > 0">
              <Flame class="h-4 w-4 text-orange-500" />
              <span class="text-xs text-orange-600">{{ streak }}</span>
            </template>
            <CheckCircle
              v-if="isActive"
              class="w-5 h-5 text-green-400" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Flame, CheckCircle, Pencil, Trash, Star } from "lucide-vue-next";

import { habitIconRegistry } from "@/constants/icons";
import type { HabitDefinition } from "@/types/app";

const props = defineProps<{
  habitKey: string;
  habit: HabitDefinition;
  isActive: boolean;
  streak: number;
  editable?: boolean;
}>();

const emit = defineEmits<{
  toggle: [habitKey: string];
  edit: [habitKey: string];
  delete: [habitKey: string];
}>();

const iconComponent = computed(() => habitIconRegistry[props.habit.icon] ?? Star);

const toggleHabit = () => {
  emit("toggle", props.habitKey);
};

const handleEdit = () => {
  emit("edit", props.habitKey);
};

const handleDelete = () => {
  emit("delete", props.habitKey);
};
</script>

<style scoped></style>
