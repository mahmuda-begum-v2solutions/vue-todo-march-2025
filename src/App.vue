<script setup lang="ts">
import { onMounted } from 'vue';
import { storeTodo } from './stores/storeTodo';
import { useTodo } from './composables/useTodo';

const store = storeTodo()

onMounted(() => {
  store.init()
})

//watch localstorage
useTodo()
</script>

<template>
  <main class="w-full min-h-screen bg-blue-50 mx-auto">
    <RouterView />
  </main>
</template>
