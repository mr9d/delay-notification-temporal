import { RouteInfoDto } from '../dto/routeinfo';
import { callComputeRoutes } from '../services/googleroutes';

/**
 * Activity to estimate the travel duration in traffic between two addresses using Google Maps Routes API.
 *
 * @param routeInfo - RouteInfoDto containing origin and destination addresses
 * @returns Estimated duration in seconds
 * @throws Error if the duration cannot be estimated
 */
export async function estimateDurationInTraffic(routeInfo: RouteInfoDto): Promise<number> {
  // Call the Google Maps Routes API to get the estimated duration
  const duration: number | undefined = await callComputeRoutes(routeInfo.originAddress, routeInfo.destinationAddress);

  // If the API does not return a duration, throw an error
  if (duration === undefined) {
    throw new Error('Could not estimate duration in traffic');
  }

  // Log the estimated duration
  console.log(
    `Estimated duration in traffic for route ${routeInfo.originAddress} - ${routeInfo.destinationAddress} is: ${duration} seconds`,
  );

  // Return the estimated duration in seconds
  return duration;
}
