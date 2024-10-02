<template>
  <div>
    <UTextarea
      class="textarea textarea-bordered w-full"
      placeholder="personal details: (ages, allergies, hobbies)..."
      v-model="personalDetails"
    ></UTextarea>
  </div>
</template>

<script setup>
const personalDetails = ref("");
const emit = defineEmits(["personalDetails"]);
watch(personalDetails, (val) => {
  emit("personalDetails", val);
});
</script>

<style lang="scss" scoped></style>
