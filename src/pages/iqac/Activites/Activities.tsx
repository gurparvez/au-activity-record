import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import NewActivity from './NewActivity';
import { myAppwrite } from '@/api/appwrite';
import { ActivityDetail } from '@/types';
import { useDispatch } from 'react-redux';
import { setActivities } from '@/store/activitiesSlice';
import { NavLink } from 'react-router';

// TODO: improve loading state

const Activities = () => {
  const [acts, setActs] = useState<ActivityDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
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

    fetchActivities();
  }, []);

  if (loading) {
    return <div>Loading activities...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="flex justify-between">
        <h1>Activities</h1>
        <div className="flex items-center *:mx-2">
          <Button variant="outline">Select</Button>
          <NewActivity />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {acts.length === 0 ? (
          <div>No activities found.</div>
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
