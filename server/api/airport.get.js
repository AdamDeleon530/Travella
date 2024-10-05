import airportResponse from "../data/airport_response.json";
export default defineEventHandler(async (event) => {
  const { location } = getQuery(event);
  const url = `https://tripadvisor16.p.rapidapi.com/api/v1/flights/searchAirport?query=${location}`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "fbcd95d911mshe77d0aca5843386p19bd36jsn4bfd95ec8251",
      "x-rapidapi-host": "tripadvisor16.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result);
    // const result = airportResponse;
    // const slimmedChildren = []; // Initialize as an empty array
    // const slimmedParents = result.data.map((i) => {
    //   const children =
    //     i.children?.map((c) => {
    //       return {
    //         airportCode: c.airportCode,
    //         coords: c.coords,
    //         name: c.name,
    //         shortName: c.shortName,
    //         url: c.url,
    //       };
    //     }) || []; // Default to empty array if undefined

    //   slimmedChildren.push(...children); // Flatten children into slimmedChildren
    //   if (!i.children) {
    //     return {
    //       airportCode: i.airportCode,
    //       coords: i.coords,
    //       name: i.name,
    //       shortName: i.shortName,
    //       url: i.url,
    //     };
    //   }
    // });

    // // Remove null values from slimmedChildren
    // const filteredChildren = slimmedChildren.filter((child) => child !== null);

    // console.log(slimmedParents);
    // return { data: [...slimmedParents, ...filteredChildren] }; // Return filtered children
  } catch (error) {
    console.error(error);
  }
});
