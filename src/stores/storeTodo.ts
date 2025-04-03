import type { TodoItem } from '@/types/types'
import { defineStore } from 'pinia'
import { toast } from 'vue3-toastify'

export const storeTodo = defineStore('todoStore', {
  state: () => ({
    showModal: false as boolean,
    todoList: [] as TodoItem[],
  }),
  actions: {
    async addTodo(text: string, description: string) {
      const item: TodoItem = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        text: text,
        description: description,
        date: new Date().getTime(),
        status: 'Active',
      }
      this.todoList.unshift(item)
      toast.success('Todo added succesfully!!', { autoClose: 1000 })
    },
    deleteTodo(id: number) {
      this.todoList = [...this.todoList].filter((item) => item.id !== id)
      toast.success('Todo deleted succesfully!!', { autoClose: 1000 })
    },
    async updateTodoField(
      id: number,
      updates: Partial<Pick<TodoItem, 'text' | 'status' | 'description'>>,
    ) {
      const todo = this.todoList.find((item) => item.id === id)
      if (!todo) return
      if (updates.text !== undefined && updates.description !== undefined) {
        todo.text = updates.text
        todo.description = updates.description
        toast.success('Todo updated successfully!', { autoClose: 1000 })
      }

      if (updates.status !== undefined) {
        todo.status = updates.status
        toast.success('Status updated successfully!', { autoClose: 1000 })
      }
    },
    showHideModal(val: boolean) {
      this.showModal = val
    },
    clearAllTodos() {
      this.todoList = []
    },
    init() {
      const getStore = localStorage.getItem('todoListByMilky')
      if (getStore) {
        try {
          const parsedArray = JSON.parse(getStore)

          if (Array.isArray(parsedArray)) {
            this.todoList = parsedArray
          } else {
            throw new Error('Invalid todo List structure')
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error(error.message)
          }
          // fallback to clean store
          localStorage.removeItem('todoListByMilky')
          localStorage.setItem('todoListByMilky', JSON.stringify(this.todoList))
        }
      }
    },
  },
  getters: {},
})
