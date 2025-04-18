// types.ts (or in the same file if preferred)
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
  attributes: Array<{
    key: string;
    type: string;
    required: boolean;
    array: boolean;
    elements?: string[];
  }>;
}

export interface Attribute {
  key: string;
  type: 'string' | 'integer' | 'float' | 'boolean' | 'email' | 'enum' | 'datetime' | 'url' | 'ip';
  required?: boolean;
  array?: boolean;
  elements?: string[]; // For enum type
}