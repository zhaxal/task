export interface Order {
  _id?: string;
  service: string;
  price: number;
  userId: string;
  createdAt: Date;
  completedAt?: Date;
  completedBy?: string;
}
