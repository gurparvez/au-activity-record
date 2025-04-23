import { myAppwrite } from '@/api/appwrite';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useParams } from 'react-router';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RootState } from '@/store';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface Document {
  $id: string;
  [key: string]: any;
}

const Activity = () => {
  const { id } = useParams<{ id: string }>();
  // console.log(id);

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get attributes from Redux
  const activity = useSelector((state: RootState) =>
    state.activities.activities.find((act) => act.collectionId === id),
  );

  const fetchDocuments = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await myAppwrite.getDocumentsOfActivity(id);
      setDocuments(response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [id]);

  if (!activity) {
    return <div>Activity not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">{activity.name}</h1>
        <NavLink to={`/team/hod/activity/${id}/new`}>
          <Button>Add New Record</Button>
        </NavLink>
      </div>

      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 text-lg">{error}</p>
              <Button variant="outline" className="mt-4" onClick={fetchDocuments}>
                Retry
              </Button>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No documents found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {activity.attributes.map((attr) => (
                    <TableHead key={attr.key} className="font-semibold">
                      {attr.key}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.$id}>
                    {activity.attributes.map((attr) => (
                      <TableCell key={`${doc.$id}-${attr.key}`}>
                        {Array.isArray(doc[attr.key])
                          ? doc[attr.key].join(', ')
                          : doc[attr.key]?.toString() || '-'}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Activity;
