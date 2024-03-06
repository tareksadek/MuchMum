import { UserType } from "./user";

export interface AdminDataType {
  users: UserType[];
  usersCount: number;
  batchesCount: number;
  teamsCount: number;
}

export type countType = number;