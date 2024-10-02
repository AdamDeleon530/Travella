const apiKey = process.env.GOOGLE_API_KEY;
export default defineEventHandler(async (event) => {
  const { start, end } = getQuery(event);
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${end}&key=${apiKey}`
    );

    const data = await response.json();

    if (data.status === "OK") {
      // Extract the waypoints and route details
      const waypoints = data.routes[0].legs[0].steps.map((step) => ({
        start_location: step.start_location,
        end_location: step.end_location,
        instructions: step.html_instructions,
        distance: step.distance.text,
        duration: step.duration.text,
      }));

      return waypoints;
    } else {
      throw new Error("Unable to retrieve waypoints. Status: " + data.status);
    }
  } catch (error) {
    console.error("Error fetching route waypoints:", error);
  }
});
