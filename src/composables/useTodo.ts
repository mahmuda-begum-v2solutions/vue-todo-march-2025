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

  // // Optional as localstorage has limit
  // watch(
  //   () => store.todoList,
  //   (newVal) => {
  //     const maxTodos = 50
  //     const trimmedList = newVal.slice(newVal.length - maxTodos)

  //     if (newVal.length > maxTodos) {
  //       alert(`Your todo list exceeded ${maxTodos} items. Older items have been removed.`)
  //     }

  //     localStorage.setItem('todoListByMilky', JSON.stringify(trimmedList))
  //   },
  //   { deep: true },
  // )

  return {}
}
