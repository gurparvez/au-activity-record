import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import NewActivity from './NewActivity';
import { myAppwrite } from '@/api/appwrite';
import { ActivityDetail } from '@/types';
import { useDispatch } from 'react-redux';
import { setActivities } from '@/store/activitiesSlice';
import { NavLink } from 'react-router';
import { Skeleton } from '@/components/ui/skeleton';

const Activities = () => {
  const [acts, setActs] = useState<ActivityDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const { activityDetails, detailedActivities } = await myAppwrite.getAllActivities();
      setActs(activityDetails);
      dispatch(
        setActivities(
          detailedActivities.map((activity) => ({
            collectionId: activity.collectionId,
            name: activity.name,
            attributes: activity.attributes,
          })),
        ),
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <>
      <div className="flex justify-between">
        <h1>Activities</h1>
        <div className="flex items-center *:mx-2">
          <Button variant="outline">Select</Button>
          <NewActivity onActivityCreated={fetchActivities} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {loading ? (
          // Skeleton cards for loading state
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="m-2">
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))
        ) : error ? (
          // Error message in place of cards
          <div className="col-span-full text-center py-8">
            <p className="text-red-500 text-lg">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={fetchActivities}
            >
              Retry
            </Button>
          </div>
        ) : acts.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-600">No activities found.</p>
          </div>
        ) : (
          acts.map((activity, index) => (
            <NavLink to={`/team/iqac/activity/${activity.collectionId}`}>
              <Card key={index} className="m-2 hover:cursor-pointer hover:scale-105 transition-all">
                <CardContent className="p-6">
                  <h6 className="text-lg font-semibold">{activity.title}</h6>
                  <span className="block text-sm text-gray-600">Forms filled: {activity.count}</span>
                  <span className="block text-sm text-gray-600">Last filled: {activity.lastFilled}</span>
                </CardContent>
              </Card>
            </NavLink>
          ))
        )}
      </div>
    </>
  );
};

export default Activities;