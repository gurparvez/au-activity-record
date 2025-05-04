import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { myAppwrite } from '@/api/appwrite';

interface ChangeRoleProps {
  user: { userId: string; username?: string; role?: string };
  onSuccess?: () => void;
}

const ChangeRole = ({ user, onSuccess }: ChangeRoleProps) => {
  const [selectedRole, setSelectedRole] = useState<string>(user.role || '');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await myAppwrite.updateUserRole(user.userId, selectedRole);
      setOpen(false);
      onSuccess?.();
    } catch (err: any) {
      setError('Failed to change role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button>Change Role</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Role: {user.username || user.userId}</DialogTitle>
          <DialogDescription>Select a new role for this user.</DialogDescription>
        </DialogHeader>

        <Select onValueChange={setSelectedRole} value={selectedRole}>
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="HOD">HOD</SelectItem>
            <SelectItem value="IQAC member">IQAC member</SelectItem>
            <SelectItem value="IQAC HOD">IQAC HOD</SelectItem>
          </SelectContent>
        </Select>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedRole || loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeRole;