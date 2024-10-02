<template>
  <div class="card mt-4 h-1/2 aspect-square">
    <!-- The div that holds the map -->
    <div id="map" ref="map" style="height: 100vh; width: 100%"></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";

// Props passed from the parent component
const props = defineProps({
  departureLocation: String,
  destination: String,
  waypoints: Array, // Array of waypoints
});

const map = ref(null);
let directionsService = null;
let directionsRenderer = null;

// Watch the props for changes to re-render the map
watch([props.departureLocation, props.destination, props.waypoints], () => {
  console.log(props);
  if (props.departureLocation && props.destination && props.waypoints) {
    console.log("hit");
    initializeMap(); // Re-render the map if inputs change
  }
});

// Function to initialize the Google Map and directions service
const initializeMap = () => {
  console.log(props.destination);
  const mapOptions = {
    zoom: 6,
    center: { lat: 34.052235, lng: -77.943848 }, // Roughly between Orlando and New York
  };
  const googleMap = new google.maps.Map(map.value, mapOptions);

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(googleMap);

  calculateAndDisplayRoute();
};

// Function to calculate and display the route
const calculateAndDisplayRoute = () => {
  const start = props.departureLocation;
  const end = props.destination;
  console.log(props.waypoints);
  // Create the request object with waypoints
  const request = {
    origin: start,
    destination: end,
    waypoints: props.waypoints.map((waypoint) => ({
      location: waypoint.end_location,
      stopover: true,
    })),
    travelMode: google.maps.TravelMode.DRIVING,
  };

  directionsService.route(request, (result, status) => {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsRenderer.setDirections(result);
    } else {
      console.error("Directions request failed due to " + status);
    }
  });
};

// Load Google Maps API script dynamically
const loadGoogleMapsScript = () => {
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${
    useRuntimeConfig().public.googleApiKey
  }&callback=initMap`;
  script.async = true;
  script.defer = true;
  window.initMap = initializeMap;
  document.head.appendChild(script);
};

// Lifecycle hook to load the map when the component is mounted
onMounted(() => {
  loadGoogleMapsScript();
});
</script>

<style scoped>
#map {
  height: 100vh;
  width: 100%;
}
</style>
