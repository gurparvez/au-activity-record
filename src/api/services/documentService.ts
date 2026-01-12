import { ID, Models } from 'appwrite';
import { db, config } from '../client';

export const documentService = {
  createDocument: async (
    collectionId: string,
    data: Record<string, any>,
  ): Promise<Models.Document> => {
    try {
      const document = await db.createDocument(config.DB_ID, collectionId, ID.unique(), data);
      return document;
    } catch (error: any) {
      console.error('Error creating document:', error);
      throw new Error(`Failed to create document: ${error.message || 'Unknown error'}`);
    }
  },

  getDocument: async (collectionId: string, documentId: string) => {
    try {
      const response = await db.getDocument(config.DB_ID, collectionId, documentId);
      if (!response) {
        throw new Error('Document not found');
      }
      return response;
    } catch (error) {
      console.error('Error fetching document:', error);
      throw new Error('Failed to get document');
    }
  },

  updateDocument: async (
    collectionId: string,
    documentId: string,
    data: Record<string, any>,
  ) => {
    try {
      await db.updateDocument(config.DB_ID, collectionId, documentId, data);
    } catch (error) {
      console.error('Error in updating document:', error);
      throw error;
    }
  },

  deleteDocument: async (collectionId: string, documentId: string) => {
    try {
      await db.deleteDocument(config.DB_ID, collectionId, documentId);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw new Error('Failed to delete document');
    }
  },
};
