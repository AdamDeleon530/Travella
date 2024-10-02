<template>
  <div class="flex gap-4 min-w-4xl">
    <!-- Budget -->

    <UInput
      type="number"
      v-model="formData.budget"
      class="flex-1"
      placeholder="Enter your total budget"
      required
    />

    <!-- Budget Range -->
    <USelect
      v-model="formData.budgetRange"
      :options="budgetRanges"
      class="flex-1"
      option-attribute="name"
    >
    </USelect>

    <!-- Density -->
    <USelect
      v-model="formData.density"
      :options="densities"
      class="flex-1"
      option-attribute="name"
    ></USelect>

    <!-- Travel Type -->
    <USelect
      v-model="formData.travelType"
      :options="travelTypes"
      class="flex-1"
      option-attribute="name"
    ></USelect>
  </div>
</template>

<script setup>
const budget = ref("");
const budgetRange = ref("budget-friendly");
const density = ref("dense");
const travelType = ref("roadtrip");
const emit = defineEmits(["update:modelValue", "invalid"]);
const formData = reactive({
  budget: "",
  budgetRange: "budget-friendly",
  density: "dense",
  travelType: "roadtrip",
});

const travelTypes = ref([
  {
    name: "Road Trip",
    value: "roadtrip",
  },
  { name: "Plane", value: "plane" },
  { name: "Train", value: "train" },
]);

const densities = ref([
  {
    name: "Dense (packed with activities)",
    value: "dense",
  },
  {
    name: "Free-flowing (relaxed schedule)",
    value: "free-flowing",
  },
]);

const budgetRanges = ref([
  { name: "Luxury", value: "luxury" },
  { name: "Mid-range", value: "mid-range" },
  { name: "Budget-friendly", value: "budget-friendly" },
]);

watch(formData, (val) => {
  if (formData.budget) {
    emit("update:modelValue", val);
    emit("invalid", false);
  } else {
    emit("invalid", true);
  }
});
</script>

<style lang="scss" scoped></style>
