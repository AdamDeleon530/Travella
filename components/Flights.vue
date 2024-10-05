<template>
  <UCard>
    <template #header>
      {{ item.title }}
    </template>
    <p><strong>Departure:</strong> {{ item.departure }}</p>
    <p><strong>Arrival:</strong> {{ item.arrival }}</p>
    <p><strong>Duration:</strong> {{ item.duration }}</p>
    <p><strong>Price:</strong> {{ item.price }}</p>
  </UCard>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    default: {},
  },
});
</script>

<style lang="scss" scoped></style>
