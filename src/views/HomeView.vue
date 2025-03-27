<script setup lang="ts">
import HeaderTodo from '@/components/HeaderTodo.vue'
import ListTodo from '@/components/ListTodo.vue';
import { storeTodo } from '@/stores/storeTodo';

const store = storeTodo()

</script>

<template>
  <div class="mb-24">
    <HeaderTodo />
    <div class="w-full max-w-4xl mx-auto">
      <ListTodo />
    </div>
    <!-- Mobile Only -->
    <div class="fixed bottom-0 left-0 right-0 p-4 sm:hidden bg-blue-50" @click="store.showHideModal(true)">
      <button class="w-full px-4 py-3 bg-blue-500 text-white shadow hover:bg-blue-600 transition rounded-lg">
        + ADD
      </button>
    </div>

  </div>
</template>
