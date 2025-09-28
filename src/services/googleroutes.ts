import * as routing from '@googlemaps/routing';

// Initialize the Google Maps Routes API client with the API key from environment variables.
const routesClient = new routing.v2.RoutesClient({ apiKey: process.env.GOOGLE_MAPS_API_KEY });

/**
 * Calls the Google Maps Routes API to compute the travel duration between two addresses.
 *
 * @param originAddress - The starting address for the route
 * @param destinationAddress - The destination address for the route
 * @returns The estimated duration in seconds, or undefined if not available
 * @throws Error if the API does not return a valid response
 */
export async function callComputeRoutes(
  originAddress: string,
  destinationAddress: string,
): Promise<number | undefined> {
  // Ensure the API key is set in environment variables.
  if (!process.env.GOOGLE_MAPS_API_KEY) {
    throw new Error('GOOGLE_MAPS_API_KEY is not set in environment variables');
  }

  // Construct the request object for the API call.
  // travelMode: 1 corresponds to 'DRIVE' (car travel mode).
  const request = {
    origin: { address: originAddress },
    destination: { address: destinationAddress },
    travelMode: 1
  };

  // Call the API with a FieldMask header to request only the 'duration' field in the response.
  const [response] = await routesClient.computeRoutes(request, {
    otherArgs: {
      headers: {
        'X-Goog-FieldMask': 'routes.duration',
      },
    },
  });

  // If no routes are returned, throw an error.
  if (!response.routes?.length) {
    throw new Error('No response from computeRoutes');
  }

  // Extract the duration in seconds from the response.
  const seconds = response.routes[0].duration?.seconds;

  // Return the duration as a number, or undefined if not available.
  return seconds ? parseInt(seconds as string) : undefined;
}
