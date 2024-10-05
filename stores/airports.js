// stores/airports.js
import { defineStore } from "pinia";

export const useAirportStore = defineStore("airports", () => {
  const airports = ref([]);
  const loading = ref(false);

  const fetchAirports = async (locations) => {
    console.log(locations);
    loading.value = true;
    try {
      locations.forEach(async (l) => {
        {
          console.log(l);
          // Fetch for the first time
          const result = await fetch(`/api/airport?locations=${l}`);
          const data = await result.json();
          airports.value.push(...data.data); // Assuming you want to accumulate results
        }
      });
    } catch (error) {
      console.error("Error fetching airports:", error);
    } finally {
      loading.value = false;
    }
  };

  return {
    airports,
    loading,
    fetchAirports,
  };
});
