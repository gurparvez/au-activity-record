import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import NewActivity from './NewActivity';
import { myAppwrite } from '@/api/appwrite';
import { ActivityDetail } from '@/types';

// TODO: improve loading state

const Activities = () => {
  const [activities, setActivities] = useState<ActivityDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const activityData = await myAppwrite.getAllActivities();
        setActivities(activityData);
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
        {activities.length === 0 ? (
          <div>No activities found.</div>
        ) : (
          activities.map((activity, index) => (
            <Card key={index} className="m-2 hover:cursor-pointer hover:scale-105 transition-all">
              <CardContent className="p-6">
                <h6 className="text-lg font-semibold">{activity.title}</h6>
                <span className="block text-sm text-gray-600">Forms filled: {activity.count}</span>
                <span className="block text-sm text-gray-600">Last filled: {activity.lastFilled}</span>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  );
};

export default Activities;
