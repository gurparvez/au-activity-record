import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input'; // Add Input component
import NewActivity from './NewActivity';
import { myAppwrite } from '@/api/appwrite';
import { ActivityDetail } from '@/types';
import { useDispatch } from 'react-redux';
import { setActivities } from '@/store/activitiesSlice';
import { NavLink } from 'react-router';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

const Activities = () => {
  const [acts, setActs] = useState<ActivityDetail[]>([]);
  const [filteredActs, setFilteredActs] = useState<ActivityDetail[]>([]); // New state for filtered activities
  const [searchQuery, setSearchQuery] = useState<string>(''); // State for search input
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null);
  const [activityToEdit, setActivityToEdit] = useState<ActivityDetail | null>(null);
  const dispatch = useDispatch();

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const { activityDetails, detailedActivities } = await myAppwrite.getAllActivities();

      const processedActivityDetails = activityDetails.map(activity => ({
        ...activity,
        attributes: activity.attributes.map(attr => ({
          ...attr,
          type: attr.elements && attr.elements.length > 0 ? 'enum' : attr.type,
        })),
      }));

      const processedDetailedActivities = detailedActivities.map(activity => ({
        ...activity,
        attributes: activity.attributes.map(attr => ({
          ...attr,
          type: attr.elements && attr.elements.length > 0 ? 'enum' : attr.type,
        })),
      }));

      setActs(processedActivityDetails);
      setFilteredActs(processedActivityDetails); // Initialize filteredActs with all activities
      dispatch(
        setActivities(
          processedDetailedActivities.map((activity) => ({
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

  const handleDelete = async (collectionId: string) => {
    try {
      setDeleteLoading(true);
      await myAppwrite.deleteActivity(collectionId);
      await fetchActivities();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleteLoading(false);
      setIsModalOpen(false);
      setActivityToDelete(null);
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

  const openDeleteModal = (collectionId: string) => {
    setActivityToDelete(collectionId);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setActivityToDelete(null);
  };

  const openEditModal = (activity: ActivityDetail) => {
    setActivityToEdit(activity);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1>Activities</h1>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-64"
          />
          <NewActivity
            onActivityCreated={fetchActivities}
            activityToEdit={activityToEdit}
            isEditing={!!activityToEdit}
            onEditComplete={() => setActivityToEdit(null)}
          />
        </div>
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
            <NavLink key={index} to={`/team/iqac/activity/${activity.collectionId}`}>
              <Card className="m-2 hover:cursor-default hover:scale-105 transition-all">
                <CardContent className="p-6 relative">
                  <h6 className="text-lg font-semibold">{activity.title}</h6>
                  <span className="block text-sm text-gray-600">
                    Forms filled: {activity.count}
                  </span>
                  <span className="block text-sm text-gray-600">
                    Last filled: {activity.lastFilled}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute bottom-2 right-25"
                    onClick={(e) => {
                      e.preventDefault();
                      openEditModal(activity);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute bottom-2 right-5"
                    onClick={(e) => {
                      e.preventDefault();
                      openDeleteModal(activity.collectionId);
                    }}
                  >
                    Delete
                  </Button>
                </CardContent>
              </Card>
            </NavLink>
          ))
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-400">Confirm Deletion !</DialogTitle>
            <DialogDescription>
              This action will permanently delete the activity and all associated data. Are you sure
              you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDeleteModal}>
              Cancel
            </Button>
            {deleteLoading ? (
              <Button variant="destructive" disabled={true}>
                Delete
                <Loader2 className="animate-spin" />
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={() => activityToDelete && handleDelete(activityToDelete)}
              >
                Delete
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Activities;