export interface ContactType {
  createdOn: Date | string | null,
  email?: string | null,
  firstName: string,
  lastName?: string,
  id?: string,
  phone?: string | null,
  note?: string | null,
  isUnique: boolean,
}

export type CreateContactResponse = {
  success: true;
  data: ContactType;
} | {
  success: false;
  error: string;
};