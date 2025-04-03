<script setup lang="ts">
import type { filterKey, Mode, TodoItem } from '@/types/types';
import { filters } from '@/constants/constants'
import { computed, onBeforeMount, onMounted, ref } from 'vue';
import { storeTodo } from '@/stores/storeTodo';
import NoDataFound from './NoDataFound.vue';
import ModalAddEdit from './ModalAddEdit.vue';
import { isTyping } from '@/utils/isTyping';
import EditIcon from './icons/EditIcon.vue';
import DeleteIcon from './icons/DeleteIcon.vue';

const store = storeTodo()

const ActiveFilter = ref<filterKey>('All')
const mode = ref<Mode>('Add')
const initialValue = ref<TodoItem | null>(null)

const FilteredTodo = computed(() => {
  if (ActiveFilter.value === 'All') {
    return store.todoList
  }
  const todos = store.todoList.filter((item) => item.status === ActiveFilter.value)
  return todos
})

const closeModal = () => {
  mode.value = 'Add'
  initialValue.value = null
  store.showHideModal(false)
}

const handleEdit = (item: TodoItem) => {
  mode.value = 'Update'
  initialValue.value = item
  store.showHideModal(true)
}

const handleStatus = (item: TodoItem) => {
  const updateStatus = item.status === 'Active' ? 'Completed' : 'Active'
  store.updateTodoField(item.id, { status: updateStatus })
}

const keyShortCutHandler = (event: KeyboardEvent) => {
  if (isTyping()) return

  const key = event.key.toLowerCase()

  if (key === 'a') {
    if (!store.showModal) openModal()
  }
}

onMounted(() => {
  document.addEventListener('keyup', keyShortCutHandler)
})

onBeforeMount(() => {
  document.addEventListener('keyup', keyShortCutHandler)
})

const openModal = () => {
  store.showHideModal(true)
}

interface Exposed {
  openModal: () => void
}

defineExpose<Exposed>({
  openModal,
})

</script>

<template>
  <div class="flex min-h-[500px] flex-col gap-y-3 p-4 mx-4 border border-blue-400 rounded-xl bg-white shadow-sm ">

    <!-- Desktop Only -->
    <div class="justify-end hidden sm:flex">
      <button @click="openModal"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition">
        + ADD
      </button>
    </div>

    <template v-if="store.todoList.length">
      <!-- Filter Tabs -->
      <div class="flex justify-between items-center">
        <!-- Filter Tabs -->
        <div class="flex gap-2">
          <div v-for="item in filters" :key="item" @click="ActiveFilter = item">
            <button :class="[
              'px-4 py-2 rounded-md border font-medium transition',
              ActiveFilter === item
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-blue-500 border-blue-300 hover:bg-blue-50'
            ]">
              {{ item }}
            </button>
          </div>
        </div>

        <!-- Clear All Button -->
        <div class="relative group flex items-center">
          <button @click="store.clearAllTodos()" class="text-base text-red-500 hover:text-red-600 font-bold transition">
            ✕
          </button>
          <!-- Tooltip Below -->
          <span
            class="absolute top-6 right-0 bg-black text-white text-[11px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-20 pointer-events-none">
            Clear All
          </span>
        </div>


      </div>


      <template v-if="FilteredTodo.length">
        <!-- Todo Card -->
        <div v-for="todo in FilteredTodo" :key="todo.id"
          class="flex flex-col sm:flex-row sm:justify-between sm:items-center border border-blue-300 rounded-lg p-4 shadow-sm hover:shadow-md transition">
          <!-- Top: Checkbox & Text -->
          <div class="flex items-start gap-x-3 mb-2 sm:mb-0">
            <label class="inline-flex items-center cursor-pointer relative mt-0.5">
              <input type="checkbox" :checked="todo.status === 'Completed'" @change="handleStatus(todo)"
                class="peer appearance-none w-5 h-5 border-2 border-yellow-500 rounded-md checked:bg-blue-500 checked:border-blue-500 transition" />
              <svg class="absolute w-4 h-4 text-white hidden peer-checked:block left-0.5 top-0.5 pointer-events-none"
                fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </label>
            <div class="flex flex-col gap-y-1">
              <p class="text-sm font-medium text-gray-800 break-words">
                {{ todo.text }}
              </p>
              <p class="text-xs font-medium text-gray-700 break-words">
                {{ todo.description }}
              </p>
            </div>
          </div>

          <!-- Bottom (mobile) / Right (desktop): Action Buttons -->
          <div class="flex gap-x-2 sm:gap-x-2 sm:justify-end">
            <!-- Edit Button -->
            <button @click="handleEdit(todo)"
              class="w-full  max-w-[414px] sm:w-auto px-4 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition shadow flex justify-center items-center gap-1">
              <span class="hidden sm:inline">Edit</span>
              <EditIcon class="sm:hidden" />
            </button>

            <!-- Delete Button -->
            <button @click="store.deleteTodo(todo.id)"
              class="w-full max-w-[414px] sm:w-auto px-4 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition shadow flex justify-center items-center gap-1">
              <span class="hidden sm:inline">Delete</span>
              <DeleteIcon class="sm:hidden" />
            </button>
          </div>
        </div>

      </template>

      <!-- No Filtered Todos -->
      <NoDataFound v-else :filter-todo="true" />
    </template>

    <!-- No Todos -->
    <NoDataFound v-else />
  </div>


  <!-- modal -->
  <ModalAddEdit ref="mainModalRef" v-if="store.showModal" :mode :initialValue @close-modal="closeModal" />
</template>
