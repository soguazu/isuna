export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};
