<template>
  <div>
    <button
      @click="showHelp = true"
      class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-white border border-neutral-300 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all opacity-80 hover:opacity-100 z-40"
      title="Информация о приватности и использовании">
      <HelpCircle class="w-5 h-5 text-neutral-600" />
    </button>

    <BaseModal
      :isOpen="showHelp"
      @close="showHelp = false">
      <div class="mb-6">
        <h3 class="text-lg font-medium text-neutral-800 mb-3 flex items-center">
          <span class="text-xl mr-2">🔒</span>
          Ваши данные в безопасности
        </h3>
        <div class="space-y-2 text-sm text-neutral-600 font-light bg-neutral-50 rounded-xl p-4">
          <p>• Все данные хранятся только у вас в браузере</p>
          <p>• Никакая информация не отправляется на серверы</p>
          <p>• Работает полностью офлайн после загрузки</p>
          <p>• Данные сохраняются между сессиями</p>
        </div>
      </div>

      <div class="flex justify-end">
        <button
          @click="showHelp = false"
          class="bg-neutral-900 text-white px-6 py-2 rounded-xl hover:bg-neutral-800 transition-colors font-medium text-sm">
          Понятно!
        </button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { HelpCircle } from "lucide-vue-next";
import BaseModal from "./base/BaseModal.vue";

const showHelp = ref(false);
</script>

<style scoped></style>
