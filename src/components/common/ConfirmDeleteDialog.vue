<template>
  <dialog
      ref="dialog"
      class="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-[#dce4dd] bg-white p-0 text-[#1b2a22] shadow-xl backdrop:bg-black/40"
      @close="emit('update:modelValue', false)"
      @click.self="close"
  >
    <form class="flex flex-col gap-4 p-6" @submit.prevent="confirm">
      <h2 class="text-lg font-extrabold">{{ title }}</h2>

      <p class="text-sm text-[#55655b]">
        <slot>Cette action est irréversible.</slot>
      </p>

      <div class="flex flex-col gap-1.5">
        <label :for="inputId" class="text-[13px] text-[#55655b]">
          Pour confirmer, tapez <strong class="text-[#1b2a22]">{{ confirmText }}</strong>
        </label>
        <input
            :id="inputId"
            v-model="typed"
            type="text"
            autocomplete="off"
            class="min-h-11 rounded-lg border border-[#c7d2c9] bg-white px-3 text-sm outline-none focus:border-[#b42318]"
        />
      </div>

      <div class="flex gap-2">
        <button
            type="button"
            class="min-h-11 flex-1 cursor-pointer rounded-[10px] border border-[#c7d2c9] bg-white px-4 text-sm hover:bg-[#f5f8f5]"
            @click="close"
        >
          Annuler
        </button>
        <button
            type="submit"
            :disabled="!canConfirm"
            class="min-h-11 flex-1 cursor-pointer rounded-[10px] bg-[#b42318] px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {{ loading ? 'Suppression...' : confirmLabel }}
        </button>
      </div>
    </form>
  </dialog>
</template>

<script setup>
import {computed, ref, useId, watch} from 'vue'

const props = defineProps({
  modelValue: {type: Boolean, default: false},
  title: {type: String, required: true},
  confirmText: {type: String, required: true},
  confirmLabel: {type: String, default: 'Supprimer'},
  loading: {type: Boolean, default: false}
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const dialog = ref(null)
const typed = ref('')
const inputId = useId()

const canConfirm = computed(() => typed.value === props.confirmText && !props.loading)

const close = () => emit('update:modelValue', false)

const confirm = () => {
  if (canConfirm.value) emit('confirm')
}

watch(() => props.modelValue, (open) => {
  if (open) {
    typed.value = ''
    dialog.value?.showModal()
  } else if (dialog.value?.open) {
    dialog.value.close()
  }
})
</script>