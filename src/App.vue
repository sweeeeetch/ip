<template>
  <div
    class="h-[100dvh] w-[100dvw]"
    :class="{ 'overflow-hidden': overflowHidden }">
    <transition name="loader">
      <AppLoader v-if="isLoading" />
    </transition>

    <template v-if="!isLoading">
      <AddToHomePrompt @show="[(overflowHidden = true), console.log('ov hide')]" />
      <div
        class="min-h-screen bg-neutral-50"
        style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
        <div class="container mx-auto px-3 sm:px-4 py-6 max-w-7xl">
          <!-- Header -->
          <div class="flex flex-col items-center gap-3 text-center md:flex-row md:items-center md:justify-between md:text-left mb-6 md:mb-10 lg:mb-12">
            <div class="flex items-center justify-center space-x-2 md:space-x-4">
              <InteractiveEye />
              <h1 class="text-4xl sm:text-5xl md:text-6xl font-extralight text-neutral-900 tracking-tight">i.p</h1>
            </div>
            <p class="text-sm sm:text-base text-neutral-600 font-light tracking-wide md:max-w-xs md:text-right">Система личной эффективности</p>
          </div>

          <!-- Navigation -->
          <div class="mb-8 md:mb-12">
            <div class="flex items-center justify-between gap-3">
              <button
                @click="changeScreen('prev')"
                class="hidden md:flex p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-all border border-neutral-100">
                <ChevronLeft class="w-6 h-6 text-neutral-600" />
              </button>

              <!-- <div class="flex-1"> -->
              <div class="flex space-x-2 sm:space-x-3 pb-2 px-1 md:px-2 overflow-x-auto overflow-y-visible">
                <RouterLink
                  v-for="screen in screens"
                  :key="screen.routeName"
                  :to="{ name: screen.routeName }"
                  class="flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-3 rounded-2xl overflow-y-visible font-light transition-all whitespace-nowrap text-xs sm:text-sm"
                  :class="currentRouteName === screen.routeName ? 'bg-neutral-900 text-white shadow-md' : 'bg-white text-neutral-600 hover:bg-neutral-50 shadow-sm border border-neutral-100'">
                  <component
                    :is="screen.icon"
                    class="w-4 h-4 shrink-0" />
                  <span class="tracking-wide">{{ screen.label }}</span>
                </RouterLink>
              </div>
              <!-- </div> -->

              <button
                @click="changeScreen('next')"
                class="hidden md:flex p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-all border border-neutral-100">
                <ChevronRight class="w-6 h-6 text-neutral-600" />
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="mb-6 md:mb-12">
            <RouterView />
          </div>

          <!-- Footer -->
          <div class="text-center pb-6">
            <div class="bg-gradient-to-r from-neutral-800 to-neutral-900 rounded-3xl shadow-sm p-6 sm:p-8 text-center">
              <p class="text-white font-light text-base sm:text-lg tracking-wide mb-2">"{{ quote?.quote }}"</p>
              <p class="text-neutral-400 font-light tracking-wide text-sm sm:text-base">— {{ quote?.author }}</p>
            </div>
          </div>
        </div>

        <!-- Кнопка справки -->
        <HelpButton />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";
import { ChevronLeft, ChevronRight, Trophy, Target, TrendingUp, Clock, Calendar as CalendarIcon, Gift, BarChart3 } from "lucide-vue-next";

import InteractiveEye from "./components/InteractiveEye.vue";
import HelpButton from "./components/HelpButton.vue";
import AddToHomePrompt from "./components/AddToHomePrompt.vue";
import AppLoader from "@/components/AppLoader.vue";

type RouteName = "habits" | "goals" | "trackers" | "planning" | "calendar" | "rewards" | "stats";

type ScreenConfig = {
  label: string;
  routeName: RouteName;
  icon: typeof Trophy;
};

const screens: ScreenConfig[] = [
  { label: "Привычки", routeName: "habits", icon: Trophy },
  { label: "Цели", routeName: "goals", icon: Target },
  { label: "Трекеры", routeName: "trackers", icon: TrendingUp },
  { label: "Планирование", routeName: "planning", icon: Clock },
  { label: "Календарь", routeName: "calendar", icon: CalendarIcon },
  { label: "Награды", routeName: "rewards", icon: Gift },
  { label: "Статистика", routeName: "stats", icon: BarChart3 },
];

const quotes = [
  {
    quote: "Радуем себя не тогда, когда есть возможность и деньги, а тогда, когда доделали важные дела",
    author: "Система личной эффективности",
  },
  {
    quote: "Не тот велик, кто никогда не падал, а тот велик — кто падал и вставал.",
    author: "Конфуций",
  },
  {
    quote: "Пока ты не сдаёшься — ты всё ещё победитель.",
    author: "Неизвестный автор",
  },
  {
    quote: "Если хочешь изменить мир — начни с себя.",
    author: "Махатма Ганди",
  },
  {
    quote: "Лучше сделать и пожалеть, чем пожалеть, что не сделал.",
    author: "Неизвестный автор",
  },
  {
    quote: "Успех — это сумма маленьких усилий, повторяющихся изо дня в день.",
    author: "Роберт Колльер",
  },
  {
    quote: "Секрет успеха — начать.",
    author: "Марк Твен",
  },
  {
    quote: "Тот, кто хочет — ищет возможности, кто не хочет — ищет причины.",
    author: "Сократ",
  },
  {
    quote: "Неважно, как медленно ты идёшь, главное — не останавливаться.",
    author: "Конфуций",
  },
  {
    quote: "Делай, что можешь, с тем, что имеешь, там, где ты есть.",
    author: "Теодор Рузвельт",
  },
  {
    quote: "Каждый день делай хотя бы один шаг к своей мечте.",
    author: "Неизвестный автор",
  },
  {
    quote: "Если не можешь лететь — беги, если не можешь бежать — иди, если не можешь идти — ползи, но продолжай двигаться к цели.",
    author: "Мартин Лютер Кинг",
  },
  {
    quote: "Величайшее счастье — знать, за что ты борешься.",
    author: "Неизвестный автор",
  },
  {
    quote: "Будущее зависит от того, что ты делаешь сегодня.",
    author: "Махатма Ганди",
  },
  {
    quote: "Дисциплина — это мост между целями и достижениями.",
    author: "Джим Рон",
  },
  {
    quote: "Чтобы дойти до цели, нужно прежде всего идти.",
    author: "Оноре де Бальзак",
  },
  {
    quote: "Не мечтай о лёгкой жизни — мечтай о силе, чтобы справиться с трудной.",
    author: "Брюс Ли",
  },
  {
    quote: "Никогда не поздно стать тем, кем ты мог бы быть.",
    author: "Джордж Элиот",
  },
  {
    quote: "Всё, что мы есть — результат наших мыслей.",
    author: "Будда",
  },
  {
    quote: "Сначала мы формируем привычки, а потом привычки формируют нас.",
    author: "Джон Драйден",
  },
  {
    quote: "Не позволяй вчерашнему дню отнимать слишком много у сегодняшнего.",
    author: "Уилл Роджерс",
  },
  {
    quote: "Если ты хочешь иметь то, чего никогда не имел — начни делать то, чего никогда не делал.",
    author: "Томас Джефферсон",
  },
  {
    quote: "Успех приходит к тем, кто слишком занят, чтобы его искать.",
    author: "Генри Дэвид Торо",
  },
  {
    quote: "Главное — не сколько времени у тебя есть, а как ты его используешь.",
    author: "Неизвестный автор",
  },
  {
    quote: "Каждое утро мы рождаемся вновь. То, что мы делаем сегодня, — самое важное.",
    author: "Будда",
  },

  {
    quote: "Делай сегодня то, что другие не хотят, завтра будешь жить так, как другие не могут.",
    author: "Джерри Райс",
  },
  {
    quote: "Порядок на столе — порядок в голове.",
    author: "Система личной эффективности",
  },
  {
    quote: "Если задача кажется сложной — разбей её на простые шаги и начни с первого.",
    author: "Система личной эффективности",
  },
  {
    quote: "Не ищи мотивацию — вырабатывай дисциплину.",
    author: "Система личной эффективности",
  },
  {
    quote: "Твоя энергия — там, где твоё внимание.",
    author: "Тони Роббинс",
  },
  {
    quote: "Самое трудное — начать действовать, всё остальное зависит только от упорства.",
    author: "Амелия Эрхарт",
  },
  {
    quote: "Не трать время на борьбу с собой — направь его на развитие себя.",
    author: "Система личной эффективности",
  },
  {
    quote: "Делай сегодня то, что другие не хотят, — завтра будешь жить так, как другие не могут.",
    author: "Неизвестный автор",
  },
  {
    quote: "Самая большая трата времени — откладывание начала.",
    author: "Дональд Кендалл",
  },
  {
    quote: "Дисциплина — это делать то, что нужно, даже когда не хочется.",
    author: "Неизвестный автор",
  },
  {
    quote: "Фокус — это умение сказать «нет» сотне хороших идей ради одной важной.",
    author: "Стив Джобс",
  },
  {
    quote: "Маленькие шаги каждый день важнее, чем большие, но редкие рывки.",
    author: "Система личной эффективности",
  },
  {
    quote: "Время — не ресурс, который у нас есть, а то, как мы им управляем.",
    author: "Неизвестный автор",
  },
  {
    quote: "Организованный день — спокойный ум.",
    author: "Система личной эффективности",
  },
  {
    quote: "Когда ты управляешь своим утром — ты управляешь своим днём.",
    author: "Робин Шарма",
  },
  {
    quote: "Не ищи мотивацию — создавай систему.",
    author: "Джеймс Клир",
  },
  {
    quote: "Сосредоточься не на том, чтобы быть занятым, а на том, чтобы быть результативным.",
    author: "Тим Феррис",
  },
  {
    quote: "Каждый день — это шанс стать на 1% лучше.",
    author: "Джеймс Клир",
  },
  {
    quote: "Твой календарь говорит правду о твоих приоритетах.",
    author: "Стивен Кови",
  },
  {
    quote: "Настоящая свобода — это умение держать обещания самому себе.",
    author: "Система личной эффективности",
  },
  {
    quote: "План без действия — просто мечта.",
    author: "Неизвестный автор",
  },
  {
    quote: "Если день не спланирован — он принадлежит случайности.",
    author: "Система личной эффективности",
  },
  {
    quote: "Не начинай день, пока он не спланирован на бумаге.",
    author: "Джим Рон",
  },
  {
    quote: "Главный враг продуктивности — перфекционизм.",
    author: "Неизвестный автор",
  },
  {
    quote: "Успех — это когда полезные привычки стали автоматическими.",
    author: "Система личной эффективности",
  },
  {
    quote: "Ничего не меняется, пока не меняется распорядок.",
    author: "Система личной эффективности",
  },
  {
    quote: "День без фокуса превращается в хаос.",
    author: "Система личной эффективности",
  },
  {
    quote: "Твоя жизнь улучшается только после того, как ты улучшаешь свои ежедневные действия.",
    author: "Робин Шарма",
  },
  {
    quote: "Планируя неделю, ты управляешь месяцем. Планируя день, — своей жизнью.",
    author: "Система личной эффективности",
  },
  {
    quote: "Люди не планируют проигрывать — они просто не планируют.",
    author: "Стивен Кови",
  },
  {
    quote: "Каждый вечер — это возможность начать заново завтра.",
    author: "Система личной эффективности",
  },
  {
    quote: "Не позволяй срочному вытеснить важное.",
    author: "Стивен Кови",
  },
  {
    quote: "Если что-то можно сделать за две минуты — сделай это сейчас.",
    author: "Дэвид Аллен",
  },
  {
    quote: "Главная привычка успешных людей — доводить начатое до конца.",
    author: "Система личной эффективности",
  },
  {
    quote: "Личная эффективность — это умение превращать энергию в результат.",
    author: "Система личной эффективности",
  },
  {
    quote: "Твой день — это отражение твоего выбора, а не обстоятельств.",
    author: "Неизвестный автор",
  },
  {
    quote: "Планируй не чтобы усложнить жизнь, а чтобы освободить ум.",
    author: "Система личной эффективности",
  },
];

const randomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};

const quote = quotes[randomInt(quotes.length - 1)];

const router = useRouter();
const route = useRoute();

const isLoading = ref(true);
const overflowHidden = ref(false);

const routeNames = screens.map(screen => screen.routeName);
const currentRouteName = computed<RouteName>(() => {
  const name = route.name as RouteName | undefined;
  return name && routeNames.includes(name) ? name : "habits";
});

const changeScreen = (direction: "next" | "prev") => {
  const currentIndex = routeNames.indexOf(currentRouteName.value);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;
  const nextIndex = direction === "next" ? (safeIndex + 1) % routeNames.length : (safeIndex - 1 + routeNames.length) % routeNames.length;
  router.push({ name: routeNames[nextIndex] });
};

onMounted(() => {
  isLoading.value = false;
});
</script>

<style>
.loader-enter-active,
.loader-leave-active {
  transition: 0.6s ease all;
}

.loader-enter-from,
.loader-leave-to {
  opacity: 0;
}

.loader-enter-to,
.loader-leave-from {
  opacity: 1;
}
</style>
