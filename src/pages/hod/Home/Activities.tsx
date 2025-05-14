import { myAppwrite } from '@/api/appwrite';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input'; // Add Input component from your UI library
import { Skeleton } from '@/components/ui/skeleton';
import { setActivities } from '@/store/activitiesSlice';
import { ActivityDetail } from '@/types';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, useParams } from 'react-router';

const Activities = () => {
  const [acts, setActs] = useState<ActivityDetail[]>([]);
  const [filteredActs, setFilteredActs] = useState<ActivityDetail[]>([]); // New state for filtered activities
  const [searchQuery, setSearchQuery] = useState<string>(''); // State for search input
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const { dept } = useParams<{ dept: string }>();

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const { activityDetails, detailedActivities } = await myAppwrite.getAllActivities();
      setActs(activityDetails);
      setFilteredActs(activityDetails); // Initialize filteredActs with all activities
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

  // Handle search input changes
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter activities based on title
    const filtered = acts.filter((activity) =>
      activity.title.toLowerCase().includes(query)
    );
    setFilteredActs(filtered);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3>Activities</h3>
        <Input
          type="text"
          placeholder="Search activities..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-64"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {loading ? (
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
          <div className="col-span-full text-center py-8">
            <p className="text-red-500 text-lg">{error}</p>
            <Button variant="outline" className="mt-4" onClick={fetchActivities}>
              Retry
            </Button>
          </div>
        ) : filteredActs.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-600">
              {searchQuery ? 'No activities match your search.' : 'No activities found.'}
            </p>
          </div>
        ) : (
          filteredActs.map((activity, index) => (
            <NavLink key={index} to={`/team/hod/${dept}/activity/${activity.collectionId}`}>
              <Card className="m-2 hover:cursor-pointer hover:scale-105 transition-all">
                <CardContent className="p-6">
                  <h6 className="text-lg font-semibold">{activity.title}</h6>
                  <span className="block text-sm text-gray-600">
                    Forms filled: {activity.count}
                  </span>
                  <span className="block text-sm text-gray-600">
                    Last filled: {activity.lastFilled}
                  </span>
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