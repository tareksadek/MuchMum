import { User } from "@firebase/auth";

export type SerializedUser = {
  uid: string;
};

export type FirebaseUser = SerializedUser & Partial<User>;