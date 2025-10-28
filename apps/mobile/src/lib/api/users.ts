import { authClient } from './authClient';

export interface User {
  _id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: 'admin' | 'farm' | 'exporter' | 'buyer' | 'logistics';
  status: 'active' | 'pending' | 'suspended';
  registeredAt: string;
  lastLogin?: string;
  metadata?: {
    farmName?: string;
    certifications?: string[];
    location?: string;
    companyName?: string;
  };
}

export interface CreateUserRequest {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  role: 'farm' | 'exporter' | 'buyer' | 'logistics';
  metadata?: {
    farmName?: string;
    certifications?: string[];
    location?: string;
    companyName?: string;
  };
}

export interface UpdateUserRequest {
  fullName?: string;
  phoneNumber?: string;
  status?: 'active' | 'pending' | 'suspended';
  metadata?: {
    farmName?: string;
    certifications?: string[];
    location?: string;
    companyName?: string;
  };
}

/**
 * Fetch all users (admin only)
 */
export const getUsers = async (): Promise<User[]> => {
  const response = await authClient.get('/users');
  return response.data;
};

/**
 * Fetch a single user by ID
 */
export const getUserById = async (userId: string): Promise<User> => {
  const response = await authClient.get(`/users/${userId}`);
  return response.data;
};

/**
 * Create a new user
 */
export const createUser = async (userData: CreateUserRequest): Promise<User> => {
  const response = await authClient.post('/users', userData);
  return response.data;
};

/**
 * Update an existing user
 */
export const updateUser = async (userId: string, userData: UpdateUserRequest): Promise<User> => {
  const response = await authClient.put(`/users/${userId}`, userData);
  return response.data;
};

/**
 * Delete a user
 */
export const deleteUser = async (userId: string): Promise<void> => {
  await authClient.delete(`/users/${userId}`);
};

/**
 * Get users by role
 */
export const getUsersByRole = async (role: string): Promise<User[]> => {
  const response = await authClient.get(`/users?role=${role}`);
  return response.data;
};
