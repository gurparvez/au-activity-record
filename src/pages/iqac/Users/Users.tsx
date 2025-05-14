import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { myAppwrite } from '@/api/appwrite';
import ApproveUsersDialog from './ApproveUsers';
import { Loader2 } from 'lucide-react';
import {
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input'; // Add Input component
import ChangeRole from './ChangeRole';

const Users = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]); // New state for filtered users
  const [searchQuery, setSearchQuery] = useState<string>(''); // State for search input
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [deleteErrors, setDeleteErrors] = useState<Record<string, string>>({});

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const allUsers = await myAppwrite.getAllUsers();
      console.log(allUsers);
      setUsers(allUsers);
      setFilteredUsers(allUsers.filter((u) => u.isApproved)); // Initialize with approved users
    } catch (err: any) {
      setError('Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle search input changes
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter approved users based on username, email, role, or departmentName
    const filtered = users.filter((user) => {
      if (!user.isApproved) return false; // Only include approved users
      return (
        (user.username || user.userId).toLowerCase().includes(query) ||
        (user.email || user.userId).toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        user.departmentName.toLowerCase().includes(query)
      );
    });
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId: string) => {
    setDeletingUserId(userId);
    try {
      await myAppwrite.deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user.userId !== userId));
      setFilteredUsers((prev) => prev.filter((user) => user.userId !== userId));
    } catch (err: any) {
      setDialogTitle('Deletion Failed');
      setDialogMessage('Failed to delete user. Please try again.');
      setDeleteErrors(err);
      setDialogOpen(true);
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      const response = await myAppwrite.approveUser(userId);
      if (response) {
        setUsers((prev) =>
          prev.map((user) => (user.userId === userId ? { ...user, isApproved: true } : user)),
        );
        setFilteredUsers((prev) =>
          prev.map((user) => (user.userId === userId ? { ...user, isApproved: true } : user)),
        );
      }
    } catch (error) {
      console.error(error);
      setDialogTitle('Approval Failed');
      setDialogMessage('Failed to approve user. Please try again.');
      setDialogOpen(true);
    }
  };

  const handleRemove = async (userId: string) => {
    console.log('Remove user:', userId);
  };

  const unapprovedUsers = users.filter((u) => !u.isApproved);

  return (
    <div>
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (selectedUserId) {
                  setConfirmDialogOpen(false);
                  await handleDelete(selectedUserId);
                  setSelectedUserId(null);
                }
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>{dialogMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDialogOpen(false)}>OK</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex justify-between items-center mb-4">
        <h1>Users</h1>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-64"
          />
          <ApproveUsersDialog
            unapprovedUsers={unapprovedUsers}
            onApprove={handleApprove}
            onRemove={handleRemove}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
          <span className="ml-2">Loading users...</span>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">
            {searchQuery ? 'No users match your search.' : 'No approved users found.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {filteredUsers.map((user) => {
            const isDeleting = deletingUserId === user.userId;
            const deleteError = deleteErrors[user.userId];

            return (
              <Card
                key={user.userId}
                className={isDeleting ? 'opacity-60 pointer-events-none' : ''}
              >
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-2">
                      <p className="font-medium">{user.username || user.userId}</p>
                      <div>
                        <p className="text-sm text-muted-foreground">{user.email || user.userId}</p>
                        <p className="text-sm text-muted-foreground">Role: {user.role}</p>
                        <p className="text-sm text-muted-foreground">
                          Department: {user.departmentName}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <ChangeRole
                        user={user}
                        onSuccess={() => {
                          fetchUsers();
                        }}
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedUserId(user.userId);
                          setConfirmDialogOpen(true);
                        }}
                        disabled={isDeleting}
                      >
                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
                      </Button>
                    </div>
                  </div>
                  {deleteError && <p className="text-sm text-red-500">{deleteError}</p>}
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