export interface Guest {
  id: string;
  name: string;
  allergies: string;
  confirmed: boolean;
  declined: boolean;
  decline_reason: string;
  createdAt: string;
}
