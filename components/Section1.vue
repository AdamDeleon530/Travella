<template>
  <div class="flex gap-4">
    <UFormGroup label="Departure Location" class="flex-1" required>
      <UInput
        v-model="formData.departureLocation"
        type="text"
        placeholder="Enter departure location"
        required
      />
    </UFormGroup>

    <!-- Destination -->
    <UFormGroup label="Destination" class="flex-1" required>
      <UInput
        v-model="formData.destination"
        type="text"
        placeholder="Enter destination"
        required
      />
    </UFormGroup>

    <UFormGroup label="Number of Travelers" class="flex-1" required>
      <USelect
        v-model="formData.numOfTravelers"
        :options="totalTravelers"
        placeholder="number of travelers"
      >
      </USelect>
    </UFormGroup>

    <!-- Travel Dates (Departure & Return) -->
    <UFormGroup label="Dates">
      <UPopover :popper="{ placement: 'bottom-start' }">
        <UButton icon="i-heroicons-calendar-days-20-solid">
          {{ format(selected.start, "d MMM, yyy") }} -
          {{ format(selected.end, "d MMM, yyy") }}
        </UButton>

        <template #panel="{ close }">
          <div
            class="flex items-center sm:divide-x divide-gray-200 dark:divide-gray-800"
          >
            <div class="hidden sm:flex flex-col py-4">
              <UButton
                v-for="(range, index) in ranges"
                :key="index"
                :label="range.label"
                color="gray"
                variant="ghost"
                class="rounded-none px-6"
                :class="[
                  isRangeSelected(range.duration)
                    ? 'bg-gray-100 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
                ]"
                truncate
                @click="selectRange(range.duration)"
              />
            </div>

            <DatePicker v-model="selected" @close="close" />
          </div>
        </template>
      </UPopover>
    </UFormGroup>
  </div>
</template>

<script setup>
import { sub, format, isSameDay } from "date-fns";
const emit = defineEmits(["update:modelValue", "invalid"]);

const selected = ref({ start: sub(new Date(), { days: 0 }), end: new Date() });

const dates = computed(() => selected.value);
const error = ref("");
const formData = reactive({
  departureLocation: "",
  destination: "",
  numOfTravelers: 1,
  datesSelected: {},
});

const ranges = [
  { label: "Last 7 days", duration: { days: 7 } },
  { label: "Last 14 days", duration: { days: 14 } },
  { label: "Last 30 days", duration: { days: 30 } },
  { label: "Last 3 months", duration: { months: 3 } },
  { label: "Last 6 months", duration: { months: 6 } },
  { label: "Last year", duration: { years: 1 } },
];

function isRangeSelected(duration) {
  return (
    isSameDay(selected.value.start, sub(new Date(), duration)) &&
    isSameDay(selected.value.end, new Date())
  );
}

function selectRange(duration) {
  selected.value = { start: sub(new Date(), duration), end: new Date() };
}

const totalTravelers = ref([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
]);

watch(formData, (val) => {
  if (formData.departureLocation && formData.destination) {
    emit("update:modelValue", val);
    emit("invalid", false);
  } else {
    emit("invalid", true);
  }
});

watchEffect(() => {
  formData.datesSelected = selected.value;
});
</script>

<style lang="scss" scoped></style>
