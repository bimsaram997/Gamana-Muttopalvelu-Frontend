export interface AddressDto {
  label: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  latitude: number;
  longitude: number;
  floor: number;
  hasElevator: boolean;
}

export interface CreateBookingPayload {
  selectedPackageId: number;
  estimatedHours: number;
  includeCleaning: boolean;
  pickupLocations: AddressDto[];
  dropoffLocation: AddressDto;
  notes?: string;
  serviceDate: string;
  fullName: string;
  email: string;
  phone: string;
  totalPrice: number;
}

export interface BookingResponse {
  bookingId: string;
  userId: string;
  fullName: string;
  email: string;
  totalAddresses: number;
  serviceDate: string;
  totalPrice: number;
  status: string;
}