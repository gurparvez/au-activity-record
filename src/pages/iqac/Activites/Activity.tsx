import { myAppwrite } from '@/api/appwrite';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useParams } from 'react-router';
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
import { formatAttributeKey } from '@/utils';

interface Document {
  $id: string;
  [key: string]: any;
}

// Utility function to format datetime
const formatDateTime = (dateTime: string): string => {
  if (!dateTime) return '-';
  try {
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return '-';
  }
};

const Activity = () => {
  const { id } = useParams<{ id: string }>();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
    <div className="p-2">
      <div className="-mx-4">
        <div className="px-4">
          <div className="flex justify-between mb-4">
            <h1 className="text-2xl font-bold">{activity.name}</h1>
            <NavLink to={`/team/hod/activity/${id}/new`}>
              <Button>Add New Record</Button>
            </NavLink>
          </div>

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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {activity.attributes.map((attr) => (
                      <TableHead key={attr.key} className="font-semibold px-4">
                        {formatAttributeKey(attr.key)}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.$id}>
                      {activity.attributes.map((attr) => (
                        <TableCell key={`${doc.$id}-${attr.key}`} className="px-4">
                          {attr.type === 'datetime'
                            ? formatDateTime(doc[attr.key])
                            : Array.isArray(doc[attr.key])
                            ? doc[attr.key].join(', ')
                            : doc[attr.key]?.toString() || '-'}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Activity;