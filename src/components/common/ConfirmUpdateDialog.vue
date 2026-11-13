<template>
  <dialog
      ref="dialog"
      class="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-[#dce4dd] bg-white p-0 text-[#1b2a22] shadow-xl backdrop:bg-black/40"
      @close="emit('update:modelValue', false)"
      @click.self="close"
  >
    <div class="flex flex-col gap-4 p-6">
      <h2 class="text-lg font-extrabold">{{ title }}</h2>

      <p class="text-sm text-[#55655b]">
        <slot>Voulez-vous enregistrer ces modifications ?</slot>
      </p>

      <div class="flex gap-2">
        <button
            type="button"
            :disabled="loading"
            class="min-h-11 flex-1 cursor-pointer rounded-[10px] border border-[#c7d2c9] bg-white px-4 text-sm hover:bg-[#f5f8f5] disabled:cursor-not-allowed disabled:opacity-40"
            @click="close"
        >
          {{ cancelLabel }}
        </button>
        <button
            type="button"
            :disabled="loading"
            class="min-h-11 flex-1 cursor-pointer rounded-[10px] bg-[#14352a] px-4 text-sm font-bold text-white hover:bg-[#1d4638] disabled:cursor-not-allowed disabled:opacity-40"
            @click="emit('confirm')"
        >
          {{ loading ? loadingLabel : confirmLabel }}
        </button>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import {ref, watch} from 'vue'

const props = defineProps({
  modelValue: {type: Boolean, default: false},
  title: {type: String, required: true},
  confirmLabel: {type: String, default: 'Enregistrer'},
  cancelLabel: {type: String, default: 'Annuler'},
  loadingLabel: {type: String, default: 'Enregistrement...'},
  loading: {type: Boolean, default: false}
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const dialog = ref(null)

const close = () => {
  if (!props.loading) emit('update:modelValue', false)
}

watch(() => props.modelValue, (open) => {
  if (open) {
    dialog.value?.showModal()
  } else if (dialog.value?.open) {
    dialog.value.close()
  }
})
</script>