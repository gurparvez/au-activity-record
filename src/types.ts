// Appwrite Document Types
export interface ActivityDocument {
  $id: string;
  user_id: string;
  activity_id: string;
  title: string;
  $createdAt: string;
  $updatedAt: string;
}

export interface ActivityDetail {
  title: string;
  count: number;
  lastFilled: string;
  collectionId: string;
  attributes: ActivityAttribute[];
}

// Supported attribute types
export type AttributeType = 'string' | 'integer' | 'float' | 'double' | 'boolean' | 'email' | 'enum' | 'datetime' | 'url' | 'ip';

export interface ActivityAttribute {
  key: string;
  type: string; // Use string to allow flexibility, but should be AttributeType
  required: boolean;
  array: boolean;
  elements?: string[];
}

// Legacy Attribute interface for backward compatibility
export interface Attribute {
  key: string;
  type: string; // Use string to allow flexibility, but should be AttributeType
  required?: boolean;
  array?: boolean;
  elements?: string[];
}

// Form Types
export interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
}

export interface LoginFormInputs {
  email: string;
  password: string;
}

// Record Form Data - allows string values and string arrays for form inputs
export type RecordFormValue = string | string[] | number | boolean | null;
export interface RecordFormData {
  [key: string]: RecordFormValue;
}

// User Types
export interface UserDocument {
  $id: string;
  userId: string;
  userName: string;
  userEmail: string;
  departmentId: string;
  role: UserRole;
  isApproved: boolean;
}

export type UserRole = 'HOD' | 'IQAC member' | 'IQAC HOD';

// Department Types
export interface Department {
  $id: string;
  name: string;
}

// API Response helper type
export interface ApiError {
  message: string;
  code?: string;
}

// Helper to extract error message
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}