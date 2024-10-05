<template>
  <UContainer class="h-screen flex flex-col items-center justify-center">
    <Stepper @submit="(v) => submitTravelDetails(v)"></Stepper>
    <div v-if="airportStore.loading">Loading airports...</div>
    <div v-else>
      <h2>Airports</h2>
      <Airports
        v-for="item in airportStore.airports"
        :key="item.airportCode"
        :item="item"
      />
      <!-- <MiniMap
        v-if="airportStore.airports.length > 0"
        :locations="airportStore.airports"
      /> -->
    </div>
  </UContainer>
</template>

<script setup>
import MapView from "~/components/map.vue";
import Airports from "~/components/Airports.vue";

import { useAirportStore } from "~/stores/airports";
const airportStore = useAirportStore();

// response
const travelItineraryObject = ref({});
const calculatedWaypoints = ref([]); // Store waypoints for Map component
const affiliateCode = useRuntimeConfig().public.affiliateCode;
const completeTravelForm = ref({});

//examples
const flights = [
  {
    airline: "Airline A",
    departure_time: "2024-10-15T10:00:00",
    arrival_time: "2024-10-15T13:00:00",
    price: "$300",
    image: "http://example.com/flight-image.jpg",
    coordinates: {
      lat: 40.712776,
      lng: -74.005974,
    },
    booking_link: `https://flights.example.com?affiliate_code=${affiliateCode}`,
  },
];

const trains = [
  {
    train_company: "Amtrak",
    departure_time: "2024-10-15T09:00:00",
    arrival_time: "2024-10-15T17:30:00",
    price: "$120",
    image: "http://example.com/train-image.jpg",
    coordinates: {
      lat: 40.712776,
      lng: -74.005974,
    },
    booking_link: `https://trains.example.com?affiliate_code=${affiliateCode}`,
  },
];

const accommodations = [
  {
    name: "Hotel B",
    price_per_night: "$150",
    check_in_time: "2024-10-15T15:00:00",
    check_out_time: "2024-10-20T11:00:00",
    image: "http://example.com/hotel-image.jpg",
    coordinates: {
      lat: 40.712776,
      lng: -74.005974,
    },
    booking_link: `https://hotels.example.com?affiliate_code=${affiliateCode}`,
  },
];

const transportation = [
  {
    type: "Car Rental",
    company: "Rental Company C",
    price: "$50/day",
    image: "http://example.com/car-image.jpg",
    coordinates: {
      lat: 40.712776,
      lng: -74.005974,
    },
    booking_link: `https://rentals.example.com?affiliate_code=${affiliateCode}`,
  },
];

const activities = [
  {
    name: "Landmark A",
    price: "$20",
    image: "http://example.com/activity-image.jpg",
    coordinates: {
      lat: 40.712776,
      lng: -74.005974,
    },
    booking_link:
      "https://activities.example.com?affiliate_code=${affiliateCode}",
  },
];

const routes = [
  {
    city: "City A",
    state: "State A",
    accommodations: accommodations,
    activities: activities,
  },
];

const submitTravelDetails = async (val) => {
  completeTravelForm.value = val;
  // Get waypoints from the backend or Google Maps API
  let waypoints = [];
  if (completeTravelForm.value.travelType == "road trip") {
    waypoints = await getRouteWaypoints();
    calculatedWaypoints.value = await summarizeWaypoints(waypoints); // Save the waypoints
  }
  const prompt = createTravelItineraryPrompt(waypoints);

  const { data, error } = await useFetch("/api/ai", {
    method: "POST",
    body: { prompt },
  });

  if (!error.value && data.value) {
    travelItineraryObject.value = data.value;
  } else {
    travelItineraryObject.value = {}; // Handle error case
  }
};

async function getRouteWaypoints() {
  const response = await $fetch(
    `/api/waypoint?start=${completeTravelForm.value.departureLocation}&end=${completeTravelForm.value.destination}`
  );
  return response; // Waypoints fetched from your API
}

const createTravelItineraryPrompt = (routeWaypoints) => {
  return `You are an AI travel agent. I need a JSON object that provides a detailed itinerary based on the following inputs:
- Personal details: ${
    completeTravelForm.value.personalDetails
  } (ensure to account for the **number of travelers** mentioned here when calculating costs)
- Departure location: ${completeTravelForm.value.departureLocation}
- Destination: ${completeTravelForm.value.destination}
- Departure date: ${completeTravelForm.value.datesSelected.start}
- Return date: ${completeTravelForm.value.datesSelected.end}
- Budget: ${
    completeTravelForm.value.budget
  } (ensure the total cost does not exceed this value)
- Budget range: ${completeTravelForm.value.budgetRange}
- Density: ${completeTravelForm.value.density}
- Travel type: ${completeTravelForm.value.travelType}
- Number Of Travellers: ${completeTravelForm.value.numOfTravelers}

**For all travel types**:
- Ensure that the itinerary respects the total budget, matches the user's travel preferences, and includes appropriate transportation, accommodations, and activities.
- If the **total estimated cost exceeds the budget**, adjust by prioritizing cheaper flights, accommodations, or fewer activities to stay within the budget.
- All booking links should include the correct affiliate codes as provided.

**If the travel type is 'road trip'**:
- The itinerary should account for all major towns, cities, and states along the way from ${
    completeTravelForm.value.departureLocation
  } to ${
    completeTravelForm.value.destination
  }, using the following waypoints to plan the trip: ${routeWaypoints.join(
    ", "
  )}.
- For each stopping point, suggest accommodations, activities, and local dining options that are within budget.
- Consider the driving distance and include appropriate rest stops.
- Provide coordinates for each attraction so they can be displayed on a map.
- Include car rental options if needed, using the affiliate link format:
  - Car rentals: 'https://rentals.example.com?affiliate_code=${affiliateCode}'

**If the travel type is 'airplane' or 'train'**:
- Include flight or train options from ${
    completeTravelForm.value.departureLocation
  } to ${
    completeTravelForm.value.destination
  }, with images and booking links including the correct affiliate codes.
- Suggest accommodations, local attractions, and activities at the destination city/state.
- Attractions should be within a reasonable distance from the center of the city.
- Provide coordinates for each attraction so they can be displayed on a map.
- If the density is 'dense', include more activities to fill the itinerary, but ensure that the **total cost remains within the budget**.
- Include local transportation options at the destination (e.g., car rentals, public transportation, rideshares), using the appropriate affiliate links.

**Affiliate Links Format**:
- Flights: 'https://flights.example.com?affiliate_code=${affiliateCode}'
- Hotels: 'https://hotels.example.com?affiliate_code=${affiliateCode}'
- Car rentals: 'https://rentals.example.com?affiliate_code=${affiliateCode}'
- Activities: 'https://activities.example.com?affiliate_code=${affiliateCode}'

**The JSON object should include the following fields**:
- 'personal_details'
- 'departure_location'
- 'destination'
- 'departure_date'
- 'return_date'
- 'budget' (ensure that the total cost is less than or equal to this value)
- 'budget_range'
- 'density'
- 'travel_type'

**Additionally**:
- For 'road trip', include a 'route' array with each stopping point containing accommodations and activities.
- For 'airplane' or 'train', include 'flights' or 'trains' array with options, and 'accommodations' and 'activities' arrays for the destination.
- Each option should include an image, coordinates (for attractions), and a booking link with the correct affiliate code.

**Estimated Total Cost Calculation**:
- For **flights**, multiply the price per flight by the number of travelers mentioned.
- For **accommodations**, multiply the price per night by the number of nights and ensure the total reflects the entire stay for all travelers.
- For **activities**, multiply the price per activity by the number of travelers.
- For **transportation**, calculate the total cost of car rentals or other forms of transport by multiplying the daily rate by the number of days at the destination.
- **Ensure the total cost does not exceed the budget**. If it does, adjust the itinerary by selecting cheaper options for flights, accommodations, and reducing the number of activities.
- Sum all costs to generate the **estimated_total_cost** and ensure it reflects the total for all travelers.

**Example Output**:

{
  "personal_details": "${completeTravelForm.value.personalDetails}",
  "departure_location": "${completeTravelForm.value.departureLocation}",
  "destination": "${completeTravelForm.value.destination}",
  "number_of_travelers": "${completeTravelForm.value.numOfTravelers}"
  "departure_date": "${completeTravelForm.value.datesSelected.start}",
  "return_date": "${completeTravelForm.value.datesSelected.end}",
  "budget": "${completeTravelForm.value.budget}",
  "budget_range": "${completeTravelForm.value.budgetRange}",
  "density": "${completeTravelForm.value.density}",
  "travel_type": "${completeTravelForm.value.travelType}",
  "flights": ${
    completeTravelForm.value.travelType === "airplane" ? flights : null
  },
  "trains": ${completeTravelForm.value.travelType === "train" ? trains : null},
  "route": ${
    completeTravelForm.value.travelType === "road trip" ? routes : null
  },
  "accommodations": ${
    completeTravelForm.value.accommodations
  } (Ensure price_per_night * number of nights, and **adjust to stay within budget**),
  "activities": ${
    completeTravelForm.value.activities
  } (Ensure activity price * number of travelers, and **adjust to stay within budget**),
  "transportation": ${
    completeTravelForm.value.transportation
  } (Ensure price * days at destination, and **adjust to stay within budget**),
  "estimated_total_cost": "Sum of all costs (flights, accommodations, activities, and transportation) ensuring it is within the total budget"
}
`;
};

// Example function to summarize waypoints to ensure each state is represented and there are <= 23 waypoints
async function summarizeWaypoints(waypoints) {
  const statesMap = new Map();

  // Process each waypoint
  for (const waypoint of waypoints) {
    const { lat, lng } = waypoint.start_location;

    // Reverse geocode the waypoint
    const { city, state } = await reverseGeocode(lat, lng);

    // Add city to its corresponding state if it's not already added
    if (!statesMap.has(state)) {
      statesMap.set(state, [city]);
    } else {
      const cities = statesMap.get(state);
      if (cities.length < 2) {
        // Optionally allow up to 2 cities per state
        cities.push(city);
      }
      statesMap.set(state, cities);
    }
  }

  // Flatten the map into a list of waypoints
  let summarizedWaypoints = [];
  statesMap.forEach((cities, state) => {
    cities.forEach((city) => {
      summarizedWaypoints.push({
        location: `${city}, ${state}`,
        stopover: true,
      });
    });
  });

  // Filter out duplicate locations
  summarizedWaypoints = summarizedWaypoints.filter(
    (waypoint, index, self) =>
      index === self.findIndex((t) => t.location === waypoint.location)
  );

  // Ensure there are no more than 23 waypoints
  if (summarizedWaypoints.length > 23) {
    summarizedWaypoints = summarizedWaypoints.slice(0, 23);
  }

  return summarizedWaypoints;
}

async function reverseGeocode(lat, lng) {
  const apiKey = "YOUR_GOOGLE_MAPS_API_KEY";
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${
      useRuntimeConfig().public.googleApiKey
    }`
  );
  const data = await response.json();

  if (data.status === "OK") {
    const addressComponents = data.results[0].address_components;
    let city = "";
    let state = "";

    // Loop through the address components to extract city and state
    for (const component of addressComponents) {
      if (component.types.includes("locality")) {
        city = component.long_name;
      }
      if (component.types.includes("administrative_area_level_1")) {
        state = component.short_name;
      }
    }

    return { city, state };
  } else {
    throw new Error(`Geocoding failed: ${data.status}`);
  }
}
</script>

<style lang="scss" scoped></style>
