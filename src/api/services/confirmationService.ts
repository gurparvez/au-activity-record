import { Query } from 'appwrite';
import { db, config } from '../client';

export const confirmationService = {
  getConfirmationDataOfDepartment: async (departmentId: string) => {
    try {
      const response = await db.listDocuments(config.DB_ID, config.CONFIRMATION_COLLECTION_ID, [
        Query.equal('department', departmentId),
      ]);
      if (response.documents.length < 1) {
        throw new Error('No data for the department!');
      }
      return response.documents[0];
    } catch (error) {
      console.error('Error getting confirmation of department:', error);
      throw error;
    }
  },

  updateConfirmationDataOfDepartment: async (departmentId: string, data: Record<string, any>) => {
    try {
      const response = await db.listDocuments(config.DB_ID, config.CONFIRMATION_COLLECTION_ID, [
        Query.equal('department', departmentId),
      ]);

      if (response.documents.length < 1) {
        throw new Error('No confirmation data found for the department!');
      }

      const documentId = response.documents[0].$id;
      const updatedDocument = await db.updateDocument(
        config.DB_ID,
        config.CONFIRMATION_COLLECTION_ID,
        documentId,
        data,
      );

      return updatedDocument;
    } catch (error) {
      console.error('Error updating confirmation data of department:', error);
      throw error;
    }
  },

  getConfirmationData: async () => {
    try {
      const response = await db.listDocuments(config.DB_ID, config.CONFIRMATION_COLLECTION_ID);
      if (response.documents.length < 1) {
        throw new Error('No Confirmation Data found');
      }
      return response.documents;
    } catch (error) {
      console.error('Error getting confirmation data:', error);
      throw error;
    }
  },
};
