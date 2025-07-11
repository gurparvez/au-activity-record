import { myAppwrite } from '@/api/appwrite';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate, useParams } from 'react-router';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

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
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const navigate = useNavigate();

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

  const handleDelete = async () => {
    if (!id || selectedDocs.length === 0) return;
    try {
      setLoading(true);
      await Promise.all(
        selectedDocs.map((docId) => {
          console.log(docId);
          return myAppwrite.deleteDocument(id, docId);
        }),
      );
      setDocuments(documents.filter((doc) => !selectedDocs.includes(doc.$id)));
      setSelectedDocs([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDocs(documents.map((doc) => doc.$id));
    } else {
      setSelectedDocs([]);
    }
  };

  const handleSelectDoc = (docId: string, checked: boolean) => {
    if (checked) {
      setSelectedDocs([...selectedDocs, docId]);
    } else {
      setSelectedDocs(selectedDocs.filter((id) => id !== docId));
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
            <div className="flex gap-2">
              {loading ? (
                <Button variant="destructive" disabled>
                  Delete
                  <Loader2 className="animate-spin" />
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={selectedDocs.length === 0}
                  className={selectedDocs.length === 0 ? 'opacity-50' : ''}
                >
                  Delete
                </Button>
              )}
              <Button variant="secondary" onClick={() => {
                navigate(`/team/iqac/activity/${id}/download`);
              }}>Download</Button>
              <NavLink to={`/team/iqac/activity/${id}/new`}>
                <Button>Add New Record</Button>
              </NavLink>
            </div>
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
                    <TableHead className="px-4">
                      <Checkbox
                        checked={selectedDocs.length === documents.length && documents.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    {activity.attributes.map((attr) => (
                      <TableHead key={attr.key} className="font-semibold px-4">
                        {formatAttributeKey(attr.key)}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.$id} className="cursor-pointer">
                      <TableCell className="px-4">
                        <Checkbox
                          checked={selectedDocs.includes(doc.$id)}
                          onCheckedChange={(checked) =>
                            handleSelectDoc(doc.$id, checked as boolean)
                          }
                          onClick={(e) => e.stopPropagation()} // Prevent row click when clicking checkbox
                        />
                      </TableCell>
                      <NavLink
                        to={`/team/iqac/activity/${id}/edit/${doc.$id}`}
                        className="contents"
                      >
                        {activity.attributes.map((attr) => (
                          <TableCell key={`${doc.$id}-${attr.key}`} className="px-4">
                            {attr.type === 'datetime'
                              ? formatDateTime(doc[attr.key])
                              : Array.isArray(doc[attr.key])
                              ? doc[attr.key].join(', ')
                              : doc[attr.key]?.toString() || '-'}
                          </TableCell>
                        ))}
                      </NavLink>
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
