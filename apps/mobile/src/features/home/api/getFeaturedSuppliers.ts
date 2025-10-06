export type Supplier = {
  id: string;
  name: string;
  category: string;
  country: string;
  rating: number;
  leadTimeDays: number;
};

const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: '1',
    name: 'Andes Coffee Cooperative',
    category: 'Coffee',
    country: 'Colombia',
    rating: 4.8,
    leadTimeDays: 7
  },
  {
    id: '2',
    name: 'Mediterranean Olive Collective',
    category: 'Olive Oil',
    country: 'Greece',
    rating: 4.7,
    leadTimeDays: 12
  },
  {
    id: '3',
    name: 'Cocoa Farmers Alliance',
    category: 'Cocoa',
    country: 'Ghana',
    rating: 4.9,
    leadTimeDays: 10
  }
];

export const getFeaturedSuppliers = async (): Promise<Supplier[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return MOCK_SUPPLIERS;
};
