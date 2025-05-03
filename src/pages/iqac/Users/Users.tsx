import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { myAppwrite } from '@/api/appwrite';
import ApproveUsersDialog from './ApproveUsers';
import { Loader2 } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [deleteErrors, setDeleteErrors] = useState<Record<string, string>>({});

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const allUsers = await myAppwrite.getAllUsers();
      setUsers(allUsers);
    } catch (err: any) {
      setError('Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId: string) => {
    setDeletingUserId(userId);
    setDeleteErrors(prev => ({ ...prev, [userId]: '' }));
    try {
      await myAppwrite.deleteUser(userId);
      setUsers(prev => prev.filter(user => user.userId !== userId));
    } catch (err: any) {
      setDeleteErrors(prev => ({
        ...prev,
        [userId]: 'Failed to delete user. Please try again.',
      }));
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleApprove = async (userId: string) => {
    console.log('Approve user:', userId);
  };

  const handleRemove = async (userId: string) => {
    console.log('Remove user:', userId);
  };

  const approvedUsers = users.filter(u => u.isApproved);
  const unapprovedUsers = users.filter(u => !u.isApproved);

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h1>Users</h1>
        <ApproveUsersDialog
          unapprovedUsers={unapprovedUsers}
          onApprove={handleApprove}
          onRemove={handleRemove}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
          <span className="ml-2">Loading users...</span>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {approvedUsers.map(user => {
            const isDeleting = deletingUserId === user.userId;
            const deleteError = deleteErrors[user.userId];

            return (
              <Card
                key={user.userId}
                className={isDeleting ? 'opacity-60 pointer-events-none' : ''}
              >
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        {user.username || user.userId}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.departmentName}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(user.userId)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Delete'
                      )}
                    </Button>
                  </div>
                  {deleteError && (
                    <p className="text-sm text-red-500">{deleteError}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Users;
