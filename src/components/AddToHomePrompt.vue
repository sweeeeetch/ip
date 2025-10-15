<template>
  <Teleport to="body">
    <Transition name="a2hp-fade">
      <div
        v-if="isVisible"
        class="a2hp-layer">
        <div
          class="a2hp-backdrop"
          aria-hidden="true"></div>
        <div class="a2hp-shell">
          <div
            v-if="showIosArrow"
            class="a2hp-arrow a2hp-arrow-ios"
            aria-hidden="true">
            <svg
              viewBox="0 0 32 72"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16 0c-1.2 0-2.2.9-2.3 2.1L12.3 48 6 40.7a2.3 2.3 0 0 0-3.4 3l10.5 14a2.3 2.3 0 0 0 3.6 0l10.5-14a2.3 2.3 0 1 0-3.4-3L19.7 48l-1.4-45.9C18.2.9 17.2 0 16 0Z"
                fill="#f9fafb" />
            </svg>
            <div class="a2hp-arrow-label">Нажмите «Поделиться»</div>
          </div>
          <div
            v-if="showAndroidArrow"
            class="a2hp-arrow a2hp-arrow-android"
            aria-hidden="true">
            <svg
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="m50.6 11.4-3-3a2.5 2.5 0 0 0-3.5 0L29 23.4V12a2.5 2.5 0 0 0-5 0v20a2.5 2.5 0 0 0 2.5 2.5h20a2.5 2.5 0 0 0 0-5H36.6L50.6 14.9a2.5 2.5 0 0 0 0-3.5Z"
                fill="#f9fafb" />
              <path
                d="M50 30a2 2 0 0 1 4 0v21.5A12.5 12.5 0 0 1 41.5 64H12.4A12.4 12.4 0 0 1 0 51.6V22.5A12.5 12.5 0 0 1 12.5 10h21.6a2 2 0 0 1 0 4H12.5A8.5 8.5 0 0 0 4 22.5v29a8.5 8.5 0 0 0 8.5 8.5h29a8.5 8.5 0 0 0 8.5-8.5Z"
                fill="#f9fafb"
                opacity=".6" />
            </svg>
            <div class="a2hp-arrow-label">Меню «⋮»</div>
          </div>
          <div
            class="a2hp-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="a2hp-title">
            <header class="a2hp-header">
              <h2
                id="a2hp-title"
                class="a2hp-title">
                Добавьте приложение на экран смартфона
              </h2>
              <p class="a2hp-subtitle">Так вы откроете его быстрее и в полноэкранном режиме.</p>
            </header>

            <section class="a2hp-content">
              <p class="a2hp-intro">Последуйте шагам ниже:</p>
              <ol class="a2hp-steps">
                <li
                  v-for="step in steps"
                  :key="step.text"
                  class="a2hp-step">
                  <span
                    v-if="step.icon === 'ios-share'"
                    class="a2hp-step-icon"
                    aria-hidden="true">
                    <svg
                      viewBox="0 0 48 48"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M34 16h-6v12a4 4 0 1 1-8 0V16h-6c-2 0-3-2.4-1.6-4l10-11.5a2.1 2.1 0 0 1 3.2 0L35.6 12c1.4 1.6.4 4-1.6 4Z"
                        fill="#111827" />
                      <path
                        d="M6 46a2 2 0 0 1-2-2V27a2 2 0 0 1 4 0v15h32V27a2 2 0 0 1 4 0v17a2 2 0 0 1-2 2Z"
                        fill="#111827"
                        opacity=".6" />
                    </svg>
                  </span>
                  <span
                    v-else-if="step.icon === 'ios-add'"
                    class="a2hp-step-icon"
                    aria-hidden="true">
                    <svg
                      viewBox="0 0 48 48"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M24 8a2 2 0 0 1 2 2v12h12a2 2 0 1 1 0 4H26v12a2 2 0 1 1-4 0V26H10a2 2 0 1 1 0-4h12V10a2 2 0 0 1 2-2Z"
                        fill="#111827" />
                    </svg>
                  </span>
                  <span
                    v-else-if="step.icon === 'android-menu'"
                    class="a2hp-step-icon"
                    aria-hidden="true">
                    <svg
                      viewBox="0 0 48 48"
                      xmlns="http://www.w3.org/2000/svg">
                      <circle
                        cx="24"
                        cy="10"
                        r="4"
                        fill="#111827" />
                      <circle
                        cx="24"
                        cy="24"
                        r="4"
                        fill="#111827" />
                      <circle
                        cx="24"
                        cy="38"
                        r="4"
                        fill="#111827" />
                    </svg>
                  </span>
                  <span
                    v-else-if="step.icon === 'android-add'"
                    class="a2hp-step-icon"
                    aria-hidden="true">
                    <svg
                      viewBox="0 0 48 48"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M24 12a2 2 0 0 1 2 2v8h8a2 2 0 1 1 0 4h-8v8a2 2 0 1 1-4 0v-8h-8a2 2 0 1 1 0-4h8v-8a2 2 0 0 1 2-2Z"
                        fill="#111827" />
                    </svg>
                  </span>
                  <span class="a2hp-step-text">{{ step.text }}</span>
                </li>
              </ol>
              <p
                v-if="closingNote"
                class="a2hp-note">
                {{ closingNote }}
              </p>
            </section>

            <footer
              v-if="showPrimaryButton"
              class="a2hp-actions">
              <button
                class="a2hp-primary"
                type="button"
                @click="handlePrimary">
                {{ primaryLabel }}
              </button>
            </footer>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { type Ref, computed, onMounted, onUnmounted, ref, watch } from "vue";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "a2hp-dismissed";
const SUPPRESS_MS = 1000 * 60 * 60 * 24; // 24 часа
const BODY_LOCK_CLASS = "a2hp-body-lock";
const body = typeof document !== "undefined" ? document.body : null;
// Share scroll lock bookkeeping with other modals via body.dataset.
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

const isVisible = ref(false);
const deferredPrompt: Ref<BeforeInstallPromptEvent | null> = ref(null);
const hideTimeout: Ref<number | null> = ref(null);

type StepIcon = "ios-share" | "ios-add" | "android-menu" | "android-add" | null;
type Step = { text: string; icon: StepIcon };

const platform = computed<"ios" | "android" | "generic">(() => {
  if (typeof navigator === "undefined") {
    return "generic";
  }

  const ua = navigator.userAgent || navigator.vendor || "";
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  return "generic";
});

const showIosArrow = computed(() => platform.value === "ios");
const showAndroidArrow = computed(() => platform.value === "android");

const steps = computed<Step[]>(() => {
  switch (platform.value) {
    case "ios":
      return [
        { text: "Нажмите значок «Поделиться» в нижней панели Safari", icon: "ios-share" },
        { text: "Выберите пункт «Добавить на экран «Домой»»", icon: "ios-add" },
        { text: "Подтвердите действие и вернитесь в приложение", icon: null },
      ];
    case "android":
      return [
        { text: "Откройте меню с тремя точками в правом верхнем углу", icon: "android-menu" },
        { text: "Нажмите «Добавить на главный экран»", icon: "android-add" },
        { text: "Подтвердите добавление ярлыка", icon: null },
      ];
    default:
      return [
        { text: "Используйте меню браузера, чтобы найти пункт добавления на главный экран", icon: null },
        { text: "Следуйте подсказкам браузера и подтвердите добавление", icon: null },
      ];
  }
});

const showPrimaryButton = computed(() => deferredPrompt.value !== null);
const primaryLabel = computed(() => "Добавить сейчас");
const closingNote = computed(() => {
  switch (platform.value) {
    case "ios":
      return "После добавления найдите ярлык на домашнем экране и открывайте приложение только через него.";
    case "android":
      return "После установки используйте значок на домашнем экране для быстрого доступа.";
    default:
      return "Следуйте подсказкам браузера, чтобы закрепить приложение на устройстве.";
  }
});

const isStandalone = () => {
  if (typeof window === "undefined") return true;
  return window.matchMedia?.("(display-mode: standalone)").matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
};

const isMobileBrowser = () => {
  if (typeof navigator === "undefined") return false;
  return /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent);
};

const shouldSuppress = () => {
  if (typeof localStorage === "undefined") return false;
  const stored = localStorage.getItem(DISMISS_KEY);
  if (!stored) return false;
  const timestamp = Number(stored);
  return !Number.isNaN(timestamp) && Date.now() - timestamp < SUPPRESS_MS;
};

const scheduleShow = () => {
  if (hideTimeout.value) {
    window.clearTimeout(hideTimeout.value);
    hideTimeout.value = null;
  }

  if (!shouldSuppress() && !isStandalone()) {
    isVisible.value = true;
  }
  // hideTimeout.value = window.setTimeout(() => {
  // }, 1200);
};

const dismiss = (remember: boolean) => {
  isVisible.value = false;
  if (remember && typeof localStorage !== "undefined") {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  }
};

const handlePrimary = async () => {
  const promptEvent = deferredPrompt.value;
  if (!promptEvent) {
    return;
  }

  promptEvent.prompt();
  const choice = await promptEvent.userChoice.catch(() => null);
  deferredPrompt.value = null;

  if (choice && choice.outcome === "accepted") {
    dismiss(true);
  }
};
const handleBeforeInstallPrompt = (event: Event) => {
  event.preventDefault();
  deferredPrompt.value = event as BeforeInstallPromptEvent;
  if (isMobileBrowser() && !isStandalone()) {
    scheduleShow();
  }
};

const handleAppInstalled = () => {
  deferredPrompt.value = null;
  dismiss(true);
};

watch(
  isVisible,
  value => {
    if (!body) return;
    if (value) {
      body.classList.add(BODY_LOCK_CLASS);
      lockScroll();
    } else {
      body.classList.remove(BODY_LOCK_CLASS);
      unlockScroll();
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (!isMobileBrowser() || isStandalone()) {
    return;
  }

  window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  window.addEventListener("appinstalled", handleAppInstalled);

  if (!shouldSuppress()) {
    scheduleShow();
  }
});

onUnmounted(() => {
  window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  window.removeEventListener("appinstalled", handleAppInstalled);
  if (hideTimeout.value) {
    window.clearTimeout(hideTimeout.value);
    hideTimeout.value = null;
  }
  if (body) {
    body.classList.remove(BODY_LOCK_CLASS);
  }
  unlockScroll();
});
</script>

<style scoped>
.a2hp-fade-enter-active,
.a2hp-fade-leave-active {
  transition: opacity 0.22s ease;
}

.a2hp-fade-enter-from,
.a2hp-fade-leave-to {
  opacity: 0;
}

.a2hp-layer {
  position: fixed;
  inset: 0;
  width: 100dvw;
  height: 100dvh;
  z-index: 99999;
  pointer-events: auto;
}

.a2hp-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 32, 0.55);
  backdrop-filter: blur(6px);
}

.a2hp-shell {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 20px 16px;
  box-sizing: border-box;
}

@media (min-width: 640px) {
  .a2hp-shell {
    align-items: center;
    padding: 24px;
  }
}

.a2hp-arrow {
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
  color: #f9fafb;
  text-shadow: 0 2px 8px rgba(15, 23, 32, 0.85);
  gap: 8px;
  --a2hp-offset-x: 0;
  transform: translateX(var(--a2hp-offset-x));
  animation: a2hp-arrow-bounce 1.8s ease-in-out infinite;
}

.a2hp-arrow svg {
  width: 38px;
  height: auto;
}

.a2hp-arrow-label {
  font-size: 13px;
  font-weight: 500;
}

.a2hp-arrow-ios {
  bottom: clamp(80px, 12vh, 120px);
  left: 50%;
  --a2hp-offset-x: -50%;
}

.a2hp-arrow-android {
  top: clamp(40px, 8vh, 72px);
  right: clamp(18px, 5vw, 42px);
  animation-direction: reverse;
}

@keyframes a2hp-arrow-bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateX(var(--a2hp-offset-x)) translateY(0);
  }
  40% {
    transform: translateX(var(--a2hp-offset-x)) translateY(-8px);
  }
  60% {
    transform: translateX(var(--a2hp-offset-x)) translateY(-4px);
  }
}

.a2hp-modal {
  position: relative;
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 16px 40px rgba(15, 23, 32, 0.25);
  padding: 28px 24px 24px;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #0f1720;
  box-sizing: border-box;
}

.a2hp-header {
  margin-bottom: 16px;
}

.a2hp-title {
  margin: 0 40px 8px 0;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.25;
}

.a2hp-subtitle {
  margin: 0;
  font-size: 15px;
  color: #4b5563;
}

.a2hp-content {
  margin-bottom: 20px;
}

.a2hp-intro {
  margin: 0 0 12px;
  font-size: 15px;
  font-weight: 500;
}

.a2hp-note {
  margin: 16px 0 0;
  font-size: 14px;
  color: #4b5563;
  line-height: 1.45;
}

.a2hp-steps {
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
  font-size: 15px;
  line-height: 1.45;
  list-style: none;
}

.a2hp-step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.a2hp-step-icon {
  flex: none;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  background: #f3f4f6;
  border-radius: 12px;
}

.a2hp-step-icon svg {
  width: 22px;
  height: 22px;
}

.a2hp-step-text {
  flex: 1;
}

.a2hp-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

@media (min-width: 480px) {
  .a2hp-actions {
    flex-direction: row;
    justify-content: flex-end;
  }
}

.a2hp-primary {
  border-radius: 12px;
  height: 48px;
  padding: 0 18px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.a2hp-primary {
  background: linear-gradient(135deg, #111827, #1f2937);
  color: #ffffff;
  box-shadow: 0 10px 18px rgba(17, 24, 39, 0.28);
}

.a2hp-primary:active {
  transform: translateY(1px);
  box-shadow: 0 6px 12px rgba(17, 24, 39, 0.18);
}
</style>

<style>
:global(body.a2hp-body-lock) {
  overflow: hidden;
  touch-action: none;
}
</style>
