export type Role = "customer" | "executor";

export interface User {
  _id?: string;
  email: string;
  role: Role | null;
  createdAt: Date;
}
