<script setup lang="ts">
import type { Mode, TodoItem } from '@/types/types';
import { onBeforeMount, onMounted, ref, watch } from 'vue';
import { storeTodo } from '@/stores/storeTodo';
import { vAutofocus } from '@/directives/vAutofocus';
import { onClickOutside } from '@vueuse/core';
import { TodoValidator } from '@/utils/validator'

const store = storeTodo()

const refModal = ref<HTMLElement | null>(null)

onClickOutside(refModal, () => {
  closeModal()
})

type PropsType = {
  initialValue: null | TodoItem;
  mode: Mode
}

const props = withDefaults(defineProps<PropsType>(), {
  mode: 'Add'
})

const todoText = ref("")
const todoErrorText = ref("")
const todoDescription = ref("")
const todoErrorDescription = ref("")
const loading = ref(false)

const emit = defineEmits<{
  (e: 'closeModal'): void
}>()

watch(() => props.initialValue, (newVal) => {
  if (newVal) {
    todoText.value = newVal.text
    todoDescription.value = newVal.description
  }
}, { immediate: true })

const validateTodo = (requireAlphaNumeric: boolean = true): boolean => {
  const validator = new TodoValidator(todoText.value, todoDescription.value);
  const isValid = validator.validate(requireAlphaNumeric);

  // Assign errors to reactive variables
  todoErrorText.value = validator.errors.title || "";
  todoErrorDescription.value = validator.errors.description || "";

  // If valid, update the sanitized values
  if (isValid) {
    const { title, description } = validator.getSanitizedData();
    todoText.value = title;
    todoDescription.value = description;
  }

  return isValid;
};

// Async: this will continue even if closeModal() is called right after (e.g., for future API handling)
const handleSave = async () => {
  //loading to handle continous button clicks
  if (loading.value) return
  loading.value = true

  //input text validation
  if (!validateTodo()) {
    loading.value = false
    return
  }

  if (props.mode === 'Add') {
    await store.addTodo(todoText.value, todoDescription.value)
  } else {
    if (props.initialValue?.id) {
      await store.updateTodoField(props.initialValue.id, { text: todoText.value, description: todoDescription.value })
    }
  }
  loading.value = false
  closeModal()
}

const closeModal = () => {
  todoText.value = '';
  todoErrorText.value = '';
  todoErrorDescription.value = '';
  emit('closeModal')
}

const keyHandler = (event: KeyboardEvent) => {
  if (loading.value) return

  const key = event.key.toLowerCase()

  if (key === 'escape') {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener('keyup', keyHandler)
})

onBeforeMount(() => {
  document.addEventListener('keyup', keyHandler)
})

</script>

<template>
  <Teleport to="body">
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <!-- Modal Container -->
      <div class="w-[90%] max-w-md bg-white rounded-xl p-6 shadow-lg relative" ref="refModal">
        <!-- Close Icon -->
        <button @click="closeModal" class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl">
          &times;
        </button>

        <!-- Modal Content -->
        <h2 class="text-lg font-semibold text-gray-800 mb-4">
          {{ mode }} Todo <span class="hidden md:inline text-sm italic text-gray-500">(Quick close: Esc)</span>
        </h2>

        <input v-autofocus type="text" v-model="todoText" @input="todoErrorText = ''" @keyup.enter.stop="handleSave"
          :placeholder="mode === 'Update' ? 'Update Todo Title' : 'Enter todo title'"
          class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          :class="todoErrorText.length === 0 ? 'mb-4' : 'mb-0'" />
        <span v-if="todoErrorText.length" class="block text-xs text-center text-red-500"
          :class="{ 'mb-4': todoErrorText.length }">
          {{ todoErrorText }}
        </span>

        <textarea v-model="todoDescription" @input="todoErrorDescription = ''"
          :placeholder="mode === 'Update' ? 'Update Todo Description' : 'Enter todo description'"
          class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          :class="todoErrorDescription.length === 0 ? 'mb-4' : 'mb-0'" />
        <span v-if="todoErrorDescription.length" class="block text-xs text-center text-red-500"
          :class="{ 'mb-4': todoErrorDescription.length }">
          {{ todoErrorDescription }}
        </span>

        <div class="flex justify-end gap-2">
          <button @click="handleSave" :disabled="loading" :class="[
            'px-4 py-2 rounded-md transition uppercase',
            loading
              ? 'bg-blue-300 cursor-not-allowed opacity-60'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          ]">
            {{ mode }}
          </button>

          <button @click="closeModal"
            class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </Teleport>

</template>
