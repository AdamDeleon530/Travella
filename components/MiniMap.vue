<template>
    <UCard>
        <div ref="map" id="map" class="map-container aspect-square"></div>
    </UCard>
</template>

<script setup lang="ts">
// Props for an array of locations
const props = defineProps({
  locations: {
    type: Array,
    required: true,
  },
});

// Ref for the map container
const map = ref(null);
let currentInfoWindow = null;
// Function to initialize the map
const initializeMap = () => {
  const googleMap = new google.maps.Map(map.value, {
    zoom: 6, // Initial zoom level
  });
  // Create a LatLngBounds object to hold the bounds of all markers
  const bounds = new google.maps.LatLngBounds();

  // Add markers for each location and extend the bounds
  props.locations.forEach((location) => {
    const [lat, lng] = location.coords.split(",").map(Number);
    const position = { lat, lng };

    // Create a marker
    const marker = new google.maps.Marker({
      position,
      map: googleMap,
      title: location.name, // Optional title for the marker
    });

    // Create an InfoWindow for each marker
    const infoWindow = new google.maps.InfoWindow({
      content: `<div style="color: black;">
                  <h1 id="firstHeading" class="firstHeading">${location.name}</h1>
                  <p>Coordinates: ${location.coords}</p>
                  <p>Airport Code: ${location.airportCode}</p>
                </div>`, // Customize the content as needed
    });

    // Add a click event listener to the marker to open the InfoWindow
    marker.addListener("click", () => {
      // Close the currently open InfoWindow if it exists
      if (currentInfoWindow) {
        currentInfoWindow.close();
      }

      // Open the new InfoWindow and set it as the current one
      infoWindow.open(googleMap, marker);
      currentInfoWindow = infoWindow; // Update the current InfoWindow reference

      // Center the map on the clicked marker
      googleMap.setCenter(position); // Center the map on the marker's position
    });

    // Extend the bounds to include this marker's position
    bounds.extend(position);
  });

  // Fit the map to the bounds of the markers
  googleMap.fitBounds(bounds);
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
.map-container {
  width: 100%;
  height: 400px;
}
</style>
