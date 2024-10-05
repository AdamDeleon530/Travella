<template>
  <ULink :href="'https://www.tripadvisor.com/' + item.url" target="_blank">
    <UCard>
      <template #header>{{ item.shortName }}</template>
    </UCard>
  </ULink>
</template>

<script setup>
const props = defineProps(["item"]);
</script>

<style lang="scss" scoped></style>
