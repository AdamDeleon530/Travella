<template>
  <UTabs :items="items" v-model="activeKey" class="min-w-full mb-8">
    <template #item="{ item }">
      <UCard>
        <template #header>
          <p
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            {{ item.label }}
          </p>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ item.description }}
          </p>
        </template>
        <component
          :is="item.component"
          :key="item.key"
          @update:modelValue="(v) => updateForm(v)"
          @invalid="(v) => (disableButton = v)"
          @personalDetails="(v) => saveDetails(v)"
          @showCards="(v) => emit('showCards')"
        ></component>
        <template #footer>
          <div class="flex justify-end">
            <UButton
              @click="prev()"
              :disabled="disableButton"
              class="mr-4"
              v-if="activeKey + 1 != 1"
              >Previous Step</UButton
            >
            <UButton @click="next" :disabled="disableButton">{{
              activeKey + 1 == items.length ? "Submit" : "Next"
            }}</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UTabs>
</template>

<script setup>
const emit = defineEmits(["submit", "showCards"]);
import { useAirportStore } from "~/stores/airports";
const store = useAirportStore();
const activeKey = ref(0);
const items = [
  {
    key: 1,
    label: "Step 1",
    description:
      "Please enter who is going, when youre planning to take this vacation and where the vacation is.",
    component: defineAsyncComponent(() => import("./Section1.vue")),
  },
  {
    key: 2,
    label: "Step 2",
    description:
      "Lets add some more details about budget, travel style, and travel type.",
    component: defineAsyncComponent(() => import("./Section2.vue")),
  },
  {
    key: 3,
    label: "Step 3",
    description:
      "Would you like to add any personal details? (i.e Family trip, allergic to peanuts, youre bringing children, hobbies...)",
    component: defineAsyncComponent(() => import("./Section3.vue")),
  },
];

const form = ref({});
const disableButton = ref(true);

const next = async () => {
  if (activeKey.value < items.length - 1) {
    if (activeKey.value + 1 === 1) {
      await store.fetchAirports([
        form.value.departureLocation,
        form.value.destination,
      ]); // Fetch airports based on departure location
    }
    activeKey.value++;
  } else {
    submit();
  }
};

const prev = () => {
  if (activeKey.value > 0) {
    activeKey.value--;
  }
};

const submit = () => {
  console.log("finished: ", form.value);
  emit("submit", form.value);
};

const saveDetails = (val) => {
  form.value.personalDetails = val;
};

const updateForm = (val) => {
  form.value = { ...form.value, ...val };
  console.log(form.value);
};
</script>

<style lang="scss" scoped></style>
