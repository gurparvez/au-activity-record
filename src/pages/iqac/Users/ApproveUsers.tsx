import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';

interface ApproveUsersDialogProps {
  unapprovedUsers: any[];
  onApprove: (userId: string) => Promise<void>; // make sure it's async
  onRemove: (userId: string) => void;
}

const ApproveUsersDialog: React.FC<ApproveUsersDialogProps> = ({
  unapprovedUsers,
  onApprove,
  onRemove,
}) => {
  const [approvingUserId, setApprovingUserId] = useState<string | null>(null);

  const handleApprove = async (userId: string) => {
    setApprovingUserId(userId);
    try {
      await onApprove(userId);
    } finally {
      setApprovingUserId(null);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative inline-block">
          <Button variant="outline">Approve Users</Button>
          {unapprovedUsers.length > 0 && (
            <>
              <span className="absolute top-1 right-1 inline-block w-2 h-2 bg-orange-600 rounded-full animate-ping" />
              <span className="absolute top-1 right-1 inline-block w-2 h-2 bg-orange-500 rounded-full" />
            </>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Unapproved Users</DialogTitle>
        </DialogHeader>
        {unapprovedUsers.length > 0 ? (
          <ScrollArea className="h-64 pr-2">
            {unapprovedUsers.map((user) => {
              const isApproving = approvingUserId === user.userId;
              return (
                <Card key={user.userId} className="mb-2">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{user.username || user.userId}</p>
                      <p className="text-sm text-muted-foreground">{user.departmentName}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(user.userId)}
                        disabled={isApproving}
                      >
                        {isApproving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Approve'
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onRemove(user.userId)}
                        disabled={isApproving}
                      >
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </ScrollArea>
        ) : (
          <div className="text-muted-foreground text-sm py-4 px-2">
            All users are already approved.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ApproveUsersDialog;
