import { Query } from 'appwrite';
import { ActivityDetail, ActivityAttribute } from '@/types';
import { account, db, functions, config } from '../client';

export interface DetailedActivity {
  collectionId: string;
  name: string;
  attributes: ActivityAttribute[];
}

export interface GetAllActivitiesResult {
  activityDetails: ActivityDetail[];
  detailedActivities: DetailedActivity[];
}

// Re-export for convenience
export type { ActivityAttribute };

export const activityService = {
  createNewActivityCollection: async (name: string, attributes: ActivityAttribute[]) => {
    const user = await account.get();

    try {
      const FUNCTION_ID = import.meta.env.VITE_APPWRITE_CREATE_COLLECTION_FUNCTION_ID || '';
      if (!FUNCTION_ID) {
        throw new Error('VITE_APPWRITE_CREATE_COLLECTION_FUNCTION_ID is not defined');
      }

      const payload = {
        databaseId: config.DB_ID,
        collectionName: name,
        attributes: attributes,
        isActivity: true,
        userId: user.$id,
      };

      const execution = await functions.createExecution(
        FUNCTION_ID,
        JSON.stringify(payload),
        false,
      );

      const response = JSON.parse(execution.responseBody || '{}');
      if (!response) {
        throw new Error('Internal Server Error!');
      }

      if (response.error) {
        throw new Error(response.error);
      }

      return response;
    } catch (error) {
      console.error('Error creating activity collection:', error);
      throw error;
    }
  },

  getAllActivities: async (): Promise<GetAllActivitiesResult> => {
    try {
      const FUNCTION_ID = import.meta.env.VITE_APPWRITE_CREATE_COLLECTION_FUNCTION_ID || '';
      if (!FUNCTION_ID) {
        throw new Error('VITE_APPWRITE_CREATE_COLLECTION_FUNCTION_ID is not defined');
      }

      if (!config.DB_ID || !config.ACTIVITIES_COLLECTION_ID) {
        throw new Error('Database ID or Activities Collection ID is not defined');
      }

      const payload = {
        databaseId: config.DB_ID,
        isGet: true,
      };

      const execution = await functions.createExecution(
        FUNCTION_ID,
        JSON.stringify(payload),
        false,
      );

      const response = JSON.parse(execution.responseBody || '{}');
      if (!response) {
        throw new Error('Internal Server Error!');
      }

      if (response.error) {
        throw new Error(response.error);
      }

      const detailedActivities: DetailedActivity[] = response.activities || [];

      const activitiesResponse = await db.listDocuments(
        config.DB_ID,
        config.ACTIVITIES_COLLECTION_ID,
      );
      const activities = activitiesResponse.documents as unknown as Array<{
        $id: string;
        activity_id: string;
        title: string;
        user_id: string;
        [key: string]: any;
      }>;

      const activityDetails = await Promise.all(
        activities.map(async (activity): Promise<ActivityDetail> => {
          const activityId = activity.activity_id;
          const detailedActivity = detailedActivities.find((da) => da.collectionId === activityId);

          try {
            const documentsResponse = await db.listDocuments(config.DB_ID, activityId);
            const documentCount = documentsResponse.total;

            const latestDocumentResponse = await db.listDocuments(config.DB_ID, activityId, [
              Query.orderDesc('$updatedAt'),
              Query.limit(1),
            ]);

            const lastUpdated =
              latestDocumentResponse.documents.length > 0
                ? latestDocumentResponse.documents[0].$updatedAt
                : null;

            return {
              collectionId: activityId,
              title: activity.title,
              count: documentCount,
              lastFilled: lastUpdated ? new Date(lastUpdated).toISOString().split('T')[0] : 'Never',
              attributes: detailedActivity ? detailedActivity.attributes : [],
            };
          } catch (error) {
            console.error(`Error fetching details for activity ${activityId}:`, error);
            return {
              collectionId: activityId,
              title: activity.title,
              count: 0,
              lastFilled: 'Error',
              attributes: detailedActivity ? detailedActivity.attributes : [],
            };
          }
        }),
      );

      return { activityDetails, detailedActivities };
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw new Error('Failed to fetch activities');
    }
  },

  updateActivityCollection: async (
    collectionId: string,
    name: string,
    attributes: ActivityAttribute[],
    forceUpdate = false,
  ) => {
    const user = await account.get();

    try {
      const FUNCTION_ID = import.meta.env.VITE_APPWRITE_UPDATE_COLLECTION_FUNCTION_ID || '';
      if (!FUNCTION_ID) {
        throw new Error('VITE_APPWRITE_UPDATE_COLLECTION_FUNCTION_ID is not defined');
      }

      const payload = {
        collectionId: collectionId,
        databaseId: config.DB_ID,
        collectionName: name,
        attributes: attributes,
        isActivity: true,
        userId: user.$id,
        forceUpdate: forceUpdate,
      };

      const execution = await functions.createExecution(
        FUNCTION_ID,
        JSON.stringify(payload),
        false,
      );

      const response = JSON.parse(execution.responseBody || '{}');

      if (forceUpdate) {
        const docs = await db.listDocuments(config.DB_ID, collectionId);
        await Promise.all(
          docs.documents.map((doc) => db.deleteDocument(config.DB_ID, collectionId, doc.$id)),
        );
      }

      if (!response) {
        throw new Error('Internal Server Error!');
      }

      if (response.error) {
        throw new Error(response.error);
      }

      return response;
    } catch (error) {
      console.error('Error updating activity collection:', error);
      throw error;
    }
  },

  getDocumentsOfActivity: async (collectionId: string) => {
    try {
      const response = await db.listDocuments(config.DB_ID, collectionId);
      if (!response) {
        throw new Error('Internal Server Error!');
      }
      return response.documents;
    } catch (error) {
      console.error('Error getting documents of activity:', error);
      throw error;
    }
  },

  deleteActivity: async (collectionId: string) => {
    try {
      const FUNCTION_ID = import.meta.env.VITE_APPWRITE_CREATE_COLLECTION_FUNCTION_ID || '';
      if (!FUNCTION_ID) {
        throw new Error('VITE_APPWRITE_CREATE_COLLECTION_FUNCTION_ID is not defined');
      }

      if (!config.DB_ID || !config.ACTIVITIES_COLLECTION_ID) {
        throw new Error('Database ID or Activities Collection ID is not defined');
      }

      const payload = {
        databaseId: config.DB_ID,
        collectionId: collectionId,
        isActivity: true,
        isDelete: true,
      };

      const execution = await functions.createExecution(
        FUNCTION_ID,
        JSON.stringify(payload),
        false,
      );

      const response = JSON.parse(execution.responseBody || '{}');
      if (!response) {
        throw new Error('Internal Server Error!');
      }

      if (response.error) {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw new Error('Failed to delete activity');
    }
  },
};
