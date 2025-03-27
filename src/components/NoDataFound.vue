<script setup lang="ts">
type FilterTodoProps = {
  filterTodo?: boolean;
};

withDefaults(defineProps<FilterTodoProps>(), {
  filterTodo: false,
});
</script>
<template>
  <div class="w-full text-center text-gray-500 italic p-6">
    <p class="text-lg">{{ filterTodo ? 'No todo in this tab' : 'No todos yet...' }}</p>
    <p class="text-sm mt-1" v-if="!filterTodo">You can add some to keep track 📝</p>
  </div>
</template>
