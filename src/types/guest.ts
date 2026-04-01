export interface Guest {
  id: string;
  name: string;
  allergies: string;
  confirmed: boolean;
  declined: boolean;
  decline_reason: string;
  companions_count: number;
  companions_names: string;
  createdAt: string;
}
