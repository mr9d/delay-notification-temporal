import { RouteInfoDto } from '../dto/routeinfo';
import { callComputeRoutes } from '../services/googleroutes';

export async function estimateDurationInTraffic(routeInfo: RouteInfoDto): Promise<number> {
  const duration: number | undefined = await callComputeRoutes(routeInfo.originAddress, routeInfo.destinationAddress);
  if (duration === undefined) {
    throw new Error('Could not estimate duration in traffic');
  }
  return duration;
}
