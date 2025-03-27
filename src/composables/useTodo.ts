import { watch } from 'vue'
import { storeTodo } from '@/stores/storeTodo'

export function useTodo() {
  const store = storeTodo()

  watch(
    () => store.todoList,
    (newVal) => {
      localStorage.setItem('todoListByMilky', JSON.stringify(newVal))
    },
    { deep: true },
  )

  return {}
}
