<template>
  <div class="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-neutral-100">
    <div class="mb-6 md:mb-8">
      <h3 class="text-xl sm:text-2xl font-light text-neutral-900 mb-2">Планирование недели</h3>
      <p class="text-sm sm:text-base text-neutral-600 font-light">Расставьте дела по часам на всю неделю</p>
    </div>

    <div class="overflow-x-auto">
      <div
        class="min-w-full"
        style="min-width: 800px">
        <!-- Header с днями недели -->
        <div class="grid grid-cols-8 gap-2 mb-4 sticky top-0 bg-white z-10">
          <div class="p-3 text-center font-medium text-neutral-700 bg-neutral-50 rounded-xl">Время</div>
          <div
            v-for="day in days"
            :key="day"
            class="p-3 text-center font-medium text-neutral-700 bg-neutral-50 rounded-xl">
            {{ day }}
          </div>
        </div>

        <!-- Сетка планирования -->
        <div class="space-y-2 max-h-[70vh] overflow-y-auto">
          <div
            v-for="hour in hours"
            :key="hour"
            class="grid grid-cols-8 gap-2">
            <div class="p-3 text-center font-medium text-neutral-600 bg-neutral-50 rounded-xl min-h-[80px] flex items-center justify-center">
              <div class="text-center">
                <div class="text-sm">{{ hour }}:00</div>
                <div
                  v-if="hour < 23"
                  class="text-xs text-neutral-400">
                  ↓
                </div>
              </div>
            </div>
            <textarea
              v-for="dayIndex in 7"
              :key="`${dayIndex}-${hour}`"
              v-model="weekPlan[`${dayIndex}-${hour}`]"
              placeholder="Добавить план..."
              class="p-3 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-400 focus:shadow-sm min-h-[80px] resize-none font-light placeholder-neutral-400 transition-all"
              :style="{ background: weekPlan[`${dayIndex}-${hour}`] ? 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' : 'white' }" />
          </div>
        </div>
      </div>
    </div>

    <!-- Полезные советы -->
    <div class="mt-6 md:mt-8 p-5 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
      <h4 class="font-medium text-neutral-800 mb-3 flex items-center">
        <Clock class="w-5 h-5 mr-2 text-blue-600" />
        Советы по планированию
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-600">
        <div>
          <p class="mb-2">• <strong>Утро (6-9):</strong> Привычки и важные дела</p>
          <p class="mb-2">• <strong>День (9-18):</strong> Основная работа и встречи</p>
        </div>
        <div>
          <p class="mb-2">• <strong>Вечер (18-22):</strong> Отдых и планирование</p>
          <p class="mb-2">• <strong>Выходные:</strong> Восстановление и хобби</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Clock } from "lucide-vue-next";

const props = defineProps<{
  weekPlan: Record<string, string>;
}>();

const emit = defineEmits<{
  updateWeekPlan: [weekPlan: Record<string, string>];
}>();

const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const hours = Array.from({ length: 18 }, (_, i) => i + 6);

const weekPlan = computed({
  get: () => props.weekPlan,
  set: (value: Record<string, string>) => emit("updateWeekPlan", value),
});
</script>

<style scoped></style>
