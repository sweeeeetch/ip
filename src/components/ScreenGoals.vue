<template>
  <div class="space-y-6 md:space-y-8">
    <!-- Добавление задач -->
    <div class="bg-white rounded-3xl shadow-sm p-4 md:p-8 border border-neutral-100">
      <h3 class="text-xl sm:text-2xl font-light text-neutral-900 mb-6 sm:mb-8">Добавить цель</h3>

      <div class="flex flex-col lg:flex-row gap-4 mb-6 sm:mb-8">
        <input
          v-model="newTask.text"
          type="text"
          placeholder="Новая цель..."
          class="flex-1 p-4 border border-neutral-200 rounded-2xl focus:border-neutral-400 focus:outline-none text-base font-light placeholder-neutral-400"
          @keypress.enter="addTask" />
        <div class="flex flex-wrap gap-4">
          <select
            v-model="newTask.type"
            class="p-4 border border-neutral-200 rounded-2xl focus:border-neutral-400 focus:outline-none text-base font-light">
            <option value="daily">Сегодня</option>
            <option value="weekly">Эта неделя</option>
            <option value="monthly">Этот месяц</option>
          </select>
          <select
            v-model.number="newTask.priority"
            class="p-4 pr-6 border border-neutral-200 rounded-2xl focus:border-neutral-400 focus:outline-none text-base font-light">
            <option :value="1">1 очко</option>
            <option :value="2">2 очка</option>
            <option :value="3">3 очка</option>
            <option :value="5">5 очков</option>
          </select>
          <button
            @click="addTask"
            class="bg-neutral-900 text-white p-4 rounded-2xl hover:bg-neutral-800 transition-colors">
            <Plus class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Ежедневные задачи -->
    <div class="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-neutral-100">
      <h3 class="text-xl font-medium text-neutral-900 mb-6 flex items-center">
        <span class="text-2xl mr-3">📋</span>
        Задачи на сегодня
      </h3>
      <div class="task-list-container">
        <TransitionGroup
          name="task-list"
          tag="div"
          class="space-y-3">
          <template v-if="dailyTasks.length">
            <div
              v-for="task in dailyTasks"
              :key="task.id"
              class="task-wrapper relative overflow-hidden rounded-xl"
              :class="{ 'task-card--removing': isRemoving(task.id, 'daily') }">
              <div
                class="task-swipe-indicator absolute inset-0 flex items-center justify-end bg-red-500 pr-6 text-white"
                :style="{ opacity: getSwipeProgress(task.id, 'daily') }">
                <Trash class="h-5 w-5" />
              </div>

              <div
                class="task-card relative z-10"
                :class="cardClasses(task, 'daily')"
                :style="cardStyle(task.id, 'daily')"
                :ref="el => setCardRef('daily', task.id, el as HTMLElement)"
                @pointerdown="handlePointerDown($event, task.id, 'daily')"
                @pointermove="handlePointerMove($event)"
                @pointerup="handlePointerUp($event, task.id, 'daily')"
                @pointercancel="handlePointerCancel($event, task.id, 'daily')"
                @click="handleToggle(task.id, 'daily')">
                <div class="flex items-start gap-3">
                  <div class="flex-1">
                    <div
                      v-if="isEditing(task.id, 'daily')"
                      class="space-y-2">
                      <textarea
                        v-model="taskDrafts.daily[task.id]"
                        rows="2"
                        class="w-full resize-none rounded-xl border border-neutral-200 bg-white p-2 text-sm font-light focus:border-neutral-400 focus:outline-none focus:ring-0"
                        :ref="el => setTextareaRef('daily', task.id, el as HTMLTextAreaElement)"
                        @pointerdown.stop
                        @keydown="handleTextareaKeydown($event, task.id, 'daily')"
                        @blur="handleEditBlur(task.id, 'daily')" />
                    </div>
                    <div
                      v-else
                      class="cursor-text"
                      @click.stop="startEditing(task, 'daily')">
                      <p
                        class="text-sm font-light leading-relaxed"
                        :class="task.completed ? 'line-through text-neutral-500' : 'text-neutral-900'">
                        {{ task.text }}
                      </p>
                    </div>
                    <div class="mt-2 text-xs text-neutral-500">
                      <span class="rounded-full bg-neutral-100 px-2 py-1 text-neutral-600">{{ task.priority }} очк</span>
                    </div>
                  </div>
                  <CheckCircle
                    v-if="task.completed"
                    class="h-5 w-5 shrink-0 text-green-500" />
                </div>
              </div>
            </div>
          </template>
          <div
            v-else
            key="daily-empty"
            class="text-neutral-500 font-light">
            Задач на сегодня нет
          </div>
        </TransitionGroup>
      </div>
    </div>

    <!-- Недельные цели -->
    <div class="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-neutral-100">
      <h3 class="text-xl font-medium text-neutral-900 mb-6 flex items-center">
        <span class="text-2xl mr-3">🎯</span>
        Цели на неделю
      </h3>
      <div class="task-list-container">
        <TransitionGroup
          name="task-list"
          tag="div"
          class="space-y-3">
          <template v-if="weeklyGoals.length">
            <div
              v-for="task in weeklyGoals"
              :key="task.id"
              class="task-wrapper relative overflow-hidden rounded-xl"
              :class="{ 'task-card--removing': isRemoving(task.id, 'weekly') }">
              <div
                class="task-swipe-indicator absolute inset-0 flex items-center justify-end bg-red-500 pr-6 text-white"
                :style="{ opacity: getSwipeProgress(task.id, 'weekly') }">
                <Trash class="h-5 w-5" />
              </div>
              <div
                class="task-card relative z-10"
                :class="cardClasses(task, 'weekly')"
                :style="cardStyle(task.id, 'weekly')"
                :ref="el => setCardRef('weekly', task.id, el as HTMLElement)"
                @pointerdown="handlePointerDown($event, task.id, 'weekly')"
                @pointermove="handlePointerMove($event)"
                @pointerup="handlePointerUp($event, task.id, 'weekly')"
                @pointercancel="handlePointerCancel($event, task.id, 'weekly')"
                @click="handleToggle(task.id, 'weekly')">
                <div class="flex items-start gap-3">
                  <div class="flex-1">
                    <div
                      v-if="isEditing(task.id, 'weekly')"
                      class="space-y-2">
                      <textarea
                        v-model="taskDrafts.weekly[task.id]"
                        rows="2"
                        class="w-full resize-none rounded-xl border border-neutral-200 bg-white p-2 text-sm font-light focus:border-neutral-400 focus:outline-none focus:ring-0"
                        :ref="el => setTextareaRef('weekly', task.id, el as HTMLTextAreaElement)"
                        @pointerdown.stop
                        @keydown="handleTextareaKeydown($event, task.id, 'weekly')"
                        @blur="handleEditBlur(task.id, 'weekly')" />
                    </div>
                    <div
                      v-else
                      class="cursor-text"
                      @click.stop="startEditing(task, 'weekly')">
                      <p
                        class="text-sm font-light leading-relaxed"
                        :class="task.completed ? 'line-through text-neutral-500' : 'text-neutral-900'">
                        {{ task.text }}
                      </p>
                    </div>
                    <div class="mt-2 text-xs text-neutral-500">
                      <span class="rounded-full bg-blue-100 px-2 py-1 text-blue-600">{{ task.priority }} очк</span>
                    </div>
                  </div>
                  <CheckCircle
                    v-if="task.completed"
                    class="h-5 w-5 shrink-0 text-green-500" />
                </div>
              </div>
            </div>
          </template>
          <div
            v-else
            key="weekly-empty"
            class="text-neutral-500 font-light">
            Недельных целей нет
          </div>
        </TransitionGroup>
      </div>
    </div>

    <!-- Месячные проекты -->
    <div class="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-neutral-100">
      <h3 class="text-xl font-medium text-neutral-900 mb-6 flex items-center">
        <span class="text-2xl mr-3">🚀</span>
        Проекты на месяц
      </h3>
      <div class="task-list-container">
        <TransitionGroup
          name="task-list"
          tag="div"
          class="space-y-3">
          <template v-if="monthlyProjects.length">
            <div
              v-for="task in monthlyProjects"
              :key="task.id"
              class="task-wrapper relative overflow-hidden rounded-xl"
              :class="{ 'task-card--removing': isRemoving(task.id, 'monthly') }">
              <div
                class="task-swipe-indicator absolute inset-0 flex items-center justify-end bg-red-500 pr-6 text-white"
                :style="{ opacity: getSwipeProgress(task.id, 'monthly') }">
                <Trash class="h-5 w-5" />
              </div>
              <div
                class="task-card relative z-10"
                :class="cardClasses(task, 'monthly')"
                :style="cardStyle(task.id, 'monthly')"
                :ref="el => setCardRef('monthly', task.id, el as HTMLElement)"
                @pointerdown="handlePointerDown($event, task.id, 'monthly')"
                @pointermove="handlePointerMove($event)"
                @pointerup="handlePointerUp($event, task.id, 'monthly')"
                @pointercancel="handlePointerCancel($event, task.id, 'monthly')"
                @click="handleToggle(task.id, 'monthly')">
                <div class="flex items-start gap-3">
                  <div class="flex-1">
                    <div
                      v-if="isEditing(task.id, 'monthly')"
                      class="space-y-2">
                      <textarea
                        v-model="taskDrafts.monthly[task.id]"
                        rows="2"
                        class="w-full resize-none rounded-xl border border-neutral-200 bg-white p-2 text-sm font-light focus:border-neutral-400 focus:outline-none focus:ring-0"
                        :ref="el => setTextareaRef('monthly', task.id, el as HTMLTextAreaElement)"
                        @pointerdown.stop
                        @keydown="handleTextareaKeydown($event, task.id, 'monthly')"
                        @blur="handleEditBlur(task.id, 'monthly')" />
                    </div>
                    <div
                      v-else
                      class="cursor-text"
                      @click.stop="startEditing(task, 'monthly')">
                      <p
                        class="text-sm font-light leading-relaxed"
                        :class="task.completed ? 'line-through text-neutral-500' : 'text-neutral-900'">
                        {{ task.text }}
                      </p>
                    </div>
                    <div class="mt-2 text-xs text-neutral-500">
                      <span class="rounded-full bg-purple-100 px-2 py-1 text-purple-600">{{ task.priority }} очк</span>
                    </div>
                  </div>
                  <CheckCircle
                    v-if="task.completed"
                    class="h-5 w-5 shrink-0 text-green-500" />
                </div>
              </div>
            </div>
          </template>
          <div
            v-else
            key="monthly-empty"
            class="text-neutral-500 font-light">
            Месячных проектов нет
          </div>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, reactive, watch } from "vue";
import { Plus, CheckCircle, Trash } from "lucide-vue-next";

import type { Task, TaskType } from "@/types/app";

const props = defineProps<{
  dailyTasks: Task[];
  weeklyGoals: Task[];
  monthlyProjects: Task[];
}>();

const emit = defineEmits<{
  addTask: [payload: { text: string; priority: number; type: TaskType }];
  toggleTask: [taskId: number, taskType: TaskType];
  updateTask: [taskId: number, taskType: TaskType, text: string];
  deleteTask: [taskId: number, taskType: TaskType];
}>();

const newTask = reactive({
  text: "",
  priority: 1,
  type: "daily" as TaskType,
});

const taskDrafts = reactive<{ daily: Record<number, string>; weekly: Record<number, string>; monthly: Record<number, string> }>({
  daily: {},
  weekly: {},
  monthly: {},
});

const textareaRefs = reactive<{ daily: Record<number, HTMLTextAreaElement | null>; weekly: Record<number, HTMLTextAreaElement | null>; monthly: Record<number, HTMLTextAreaElement | null> }>({
  daily: {},
  weekly: {},
  monthly: {},
});

const cardRefs = reactive<{ daily: Record<number, HTMLElement | null>; weekly: Record<number, HTMLElement | null>; monthly: Record<number, HTMLElement | null> }>({
  daily: {},
  weekly: {},
  monthly: {},
});

const editingTask = reactive<{ type: TaskType | null; id: number | null }>({
  type: null,
  id: null,
});

const createSwipeState = () => ({
  offsets: {} as Record<number, number>,
  removing: {} as Record<number, boolean>,
});

const swipeOffsets = reactive<{ daily: Record<number, number>; weekly: Record<number, number>; monthly: Record<number, number> }>({
  daily: {},
  weekly: {},
  monthly: {},
});

const removingTasks = reactive<{ daily: Record<number, boolean>; weekly: Record<number, boolean>; monthly: Record<number, boolean> }>({
  daily: {},
  weekly: {},
  monthly: {},
});

const swipeState = reactive<{
  activeId: number | null;
  type: TaskType | null;
  startX: number;
  pointerId: number | null;
  dragging: boolean;
}>({
  activeId: null,
  type: null,
  startX: 0,
  pointerId: null,
  dragging: false,
});

const addTask = () => {
  const text = newTask.text.trim();
  if (!text) return;

  emit("addTask", {
    text,
    priority: newTask.priority,
    type: newTask.type,
  });

  newTask.text = "";
};

const deleteTask = (taskId: number, type: TaskType) => {
  emit("deleteTask", taskId, type);
};

const getTaskCollection = (type: TaskType) => {
  switch (type) {
    case "daily":
      return props.dailyTasks;
    case "weekly":
      return props.weeklyGoals;
    default:
      return props.monthlyProjects;
  }
};

const getTaskById = (taskId: number, type: TaskType) => getTaskCollection(type).find(task => task.id === taskId);

const isEditing = (taskId: number, type: TaskType) => editingTask.type === type && editingTask.id === taskId;

const ensureDraft = (taskId: number, type: TaskType, text: string) => {
  if (taskDrafts[type][taskId] === undefined) {
    taskDrafts[type][taskId] = text;
  }
};

const setTextareaRef = (type: TaskType, taskId: number, el: HTMLTextAreaElement | null) => {
  if (!el) {
    delete textareaRefs[type][taskId];
  } else {
    textareaRefs[type][taskId] = el;
  }
};

const setCardRef = (type: TaskType, taskId: number, el: HTMLElement | null) => {
  if (!el) {
    delete cardRefs[type][taskId];
  } else {
    cardRefs[type][taskId] = el;
  }
};

const startEditing = (task: Task, type: TaskType) => {
  ensureDraft(task.id, type, task.text);
  editingTask.type = type;
  editingTask.id = task.id;
  nextTick(() => {
    const ref = textareaRefs[type][task.id];
    if (ref) {
      const length = ref.value.length;
      ref.focus();
      ref.setSelectionRange(length, length);
    }
  });
};

const stopEditing = () => {
  editingTask.type = null;
  editingTask.id = null;
};

const handleEditBlur = (taskId: number, type: TaskType) => {
  commitTaskChanges(taskId, type, true);
};

const handleTextareaKeydown = (event: KeyboardEvent, taskId: number, type: TaskType) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    commitTaskChanges(taskId, type, true);
  } else if (event.key === "Escape") {
    event.preventDefault();
    commitTaskChanges(taskId, type, false);
  }
};

const commitTaskChanges = (taskId: number, type: TaskType, submit: boolean) => {
  const draft = taskDrafts[type][taskId];
  const original = getTaskById(taskId, type);
  if (!submit && original) {
    taskDrafts[type][taskId] = original.text;
  } else if (typeof draft === "string") {
    emit("updateTask", taskId, type, draft.trim());
  }
  stopEditing();
};

const syncDrafts = (tasks: Task[], store: Record<number, string>) => {
  const next: Record<number, string> = {};
  tasks.forEach(task => {
    next[task.id] = store[task.id] ?? task.text;
  });
  Object.keys(store).forEach(key => {
    if (!(key in next)) {
      delete store[Number(key)];
    }
  });
  Object.entries(next).forEach(([key, value]) => {
    store[Number(key)] = value;
  });
};

const syncSwipeOffsets = (tasks: Task[], store: Record<number, number>) => {
  const ids = new Set(tasks.map(task => task.id));
  Object.keys(store).forEach(key => {
    if (!ids.has(Number(key))) {
      delete store[Number(key)];
    }
  });
};

const syncRemovingState = (tasks: Task[], store: Record<number, boolean>) => {
  const ids = new Set(tasks.map(task => task.id));
  Object.keys(store).forEach(key => {
    if (!ids.has(Number(key))) {
      delete store[Number(key)];
    }
  });
  tasks.forEach(task => {
    if (store[task.id] === undefined) {
      store[task.id] = false;
    }
  });
};

const ensureEditingStateValid = () => {
  if (!editingTask.type || editingTask.id === null) return;
  const collection = getTaskCollection(editingTask.type);
  if (!collection.some(task => task.id === editingTask.id)) {
    stopEditing();
  }
};

watch(
  () => props.dailyTasks,
  tasks => {
    syncDrafts(tasks, taskDrafts.daily);
    syncSwipeOffsets(tasks, swipeOffsets.daily);
    syncRemovingState(tasks, removingTasks.daily);
    ensureEditingStateValid();
  },
  { immediate: true, deep: true }
);

watch(
  () => props.weeklyGoals,
  tasks => {
    syncDrafts(tasks, taskDrafts.weekly);
    syncSwipeOffsets(tasks, swipeOffsets.weekly);
    syncRemovingState(tasks, removingTasks.weekly);
    ensureEditingStateValid();
  },
  { immediate: true, deep: true }
);

watch(
  () => props.monthlyProjects,
  tasks => {
    syncDrafts(tasks, taskDrafts.monthly);
    syncSwipeOffsets(tasks, swipeOffsets.monthly);
    syncRemovingState(tasks, removingTasks.monthly);
    ensureEditingStateValid();
  },
  { immediate: true, deep: true }
);

const isSwiping = (taskId: number, type: TaskType) => swipeState.dragging && swipeState.type === type && swipeState.activeId === taskId;

const getSwipeOffset = (taskId: number, type: TaskType) => swipeOffsets[type][taskId] ?? 0;

const getSwipeProgress = (taskId: number, type: TaskType) => {
  if (isRemoving(taskId, type)) return 1;
  return Math.min(1, Math.abs(getSwipeOffset(taskId, type)) / 100);
};

const isRemoving = (taskId: number, type: TaskType) => removingTasks[type][taskId] === true;

const cardStyle = (taskId: number, type: TaskType) => ({
  transform: `translateX(${getSwipeOffset(taskId, type)}px)`,
});

const cardClasses = (task: Task, type: TaskType) => {
  const base = ["rounded-xl", "border", "p-4", "transition-transform", isSwiping(task.id, type) ? "duration-0" : "duration-200"];

  if (type === "weekly") {
    base.push("border-l-4", "border-l-blue-400");
  } else if (type === "monthly") {
    base.push("border-l-4", "border-l-purple-400");
  }

  if (task.completed) {
    base.push("bg-neutral-50", "border-neutral-200", "task-card--completed");
  } else {
    base.push("bg-white", "border-neutral-200", "hover:shadow-md", "hover:border-neutral-300");
  }

  if (isRemoving(task.id, type)) {
    base.push("pointer-events-none");
  }

  return base;
};

const resetSwipeState = () => {
  swipeState.activeId = null;
  swipeState.type = null;
  swipeState.pointerId = null;
  swipeState.dragging = false;
};

const handlePointerDown = (event: PointerEvent, taskId: number, type: TaskType) => {
  if (isEditing(taskId, type)) return;
  if (event.pointerType === "mouse" && event.button !== 0) return;

  removingTasks[type][taskId] = false;
  if (swipeOffsets[type][taskId] === undefined) {
    swipeOffsets[type][taskId] = 0;
  }

  swipeState.activeId = taskId;
  swipeState.type = type;
  swipeState.pointerId = event.pointerId;
  swipeState.startX = event.clientX;
  swipeState.dragging = true;

  if (event.currentTarget instanceof HTMLElement) {
    event.currentTarget.setPointerCapture(event.pointerId);
  }
};

const handlePointerMove = (event: PointerEvent) => {
  if (!swipeState.dragging || swipeState.type === null || swipeState.activeId === null) return;

  const delta = event.clientX - swipeState.startX;
  if (delta > 0) {
    swipeOffsets[swipeState.type][swipeState.activeId] = Math.min(delta * 0.3, 20);
    return;
  }

  event.preventDefault();
  swipeOffsets[swipeState.type][swipeState.activeId] = Math.max(delta, -140);
};

const animateRemoval = (taskId: number, type: TaskType) => {
  const card = cardRefs[type][taskId];
  removingTasks[type][taskId] = true;

  if (card) {
    const startingTransform = card.style.transform || `translateX(${getSwipeOffset(taskId, type)}px)`;
    card.style.transition = "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.2s ease";
    card.style.willChange = "transform, opacity";
    card.style.transform = startingTransform;
    card.style.opacity = "1";

    requestAnimationFrame(() => {
      card.style.transform = "translateX(-120%)";
      card.style.opacity = "0";
    });
  }

  setTimeout(() => {
    delete removingTasks[type][taskId];
    delete swipeOffsets[type][taskId];
    delete cardRefs[type][taskId];
    deleteTask(taskId, type);
  }, 260);
};

const finishSwipe = (taskId: number, type: TaskType, shouldDelete: boolean) => {
  if (shouldDelete) {
    animateRemoval(taskId, type);
  } else {
    swipeOffsets[type][taskId] = 0;
    removingTasks[type][taskId] = false;
  }
  resetSwipeState();
};

const handlePointerUp = (event: PointerEvent, taskId: number, type: TaskType) => {
  if (!swipeState.dragging || swipeState.type !== type || swipeState.activeId !== taskId) return;

  const offset = getSwipeOffset(taskId, type);
  const shouldDelete = offset <= -80;

  if (event.currentTarget instanceof HTMLElement && swipeState.pointerId !== null) {
    event.currentTarget.releasePointerCapture(swipeState.pointerId);
  }

  finishSwipe(taskId, type, shouldDelete);
};

const handlePointerCancel = (event: PointerEvent, taskId: number, type: TaskType) => {
  if (event.currentTarget instanceof HTMLElement && swipeState.pointerId !== null) {
    event.currentTarget.releasePointerCapture(swipeState.pointerId);
  }

  if (swipeState.type === type && swipeState.activeId === taskId) {
    finishSwipe(taskId, type, false);
  }
};

const handleToggle = (taskId: number, type: TaskType) => {
  if (isEditing(taskId, type) || isSwiping(taskId, type) || isRemoving(taskId, type)) return;
  emit("toggleTask", taskId, type);
};
</script>

<style scoped>
.task-list-container {
  max-height: 16rem;
  overflow-y: auto;
  padding-right: 0.25rem;
}

.task-list-move {
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}

.task-list-enter-active,
.task-list-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.task-list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.task-card {
  cursor: grab;
  touch-action: pan-y;
  will-change: transform;
  transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.2s ease;
  background-color: white;
}

.task-wrapper {
  position: relative;
}

.task-card:active {
  cursor: grabbing;
}

.task-card--completed {
  opacity: 0.75;
}

.task-card--removing .task-card {
  pointer-events: none;
  animation: task-swipe-out 0.24s forwards ease-in;
}

.task-swipe-indicator {
  transition: opacity 0.2s ease;
}

@keyframes task-swipe-out {
  to {
    transform: translateX(-120%);
    opacity: 0;
  }
}
</style>
