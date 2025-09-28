import * as routing from '@googlemaps/routing';

const routesClient = new routing.v2.RoutesClient({ apiKey: process.env.GOOGLE_MAPS_API_KEY });

export async function callComputeRoutes(
  originAddress: string,
  destinationAddress: string,
): Promise<number | undefined> {
  // Construct request
  const request = {
    origin: { address: originAddress },
    destination: { address: destinationAddress },
    travelMode: 1, // DRIVE
  };

  // Run request with FieldMask header for duration only
  const [response] = await routesClient.computeRoutes(request, {
    otherArgs: {
      headers: {
        'X-Goog-FieldMask': 'routes.duration',
      },
    },
  });

  if (!response.routes?.length) {
    throw new Error('No response from computeRoutes');
  }

  const seconds = response.routes[0].duration?.seconds;

  return seconds ? parseInt(seconds as string) : undefined;
}
