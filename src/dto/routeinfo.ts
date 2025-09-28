/**
 * Data Transfer Object (DTO) representing route information for delivery calculations.
 *
 * @property originAddress - The starting address for the delivery route
 * @property destinationAddress - The destination address for the delivery route
 */
export type RouteInfoDto = {
  originAddress: string;
  destinationAddress: string;
};
