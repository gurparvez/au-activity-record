// TODO: COMPLETE PROFILE

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { account } from '@/api/appwrite';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await account.deleteSession('current');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Logout</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Logout</DialogTitle>
                <DialogDescription>Are you sure you want to logout?</DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2 mt-4">
                <DialogClose asChild>
                  {loading ? (
                    <Button variant="outline" disabled className="bg-gray-600">
                      Cancel
                    </Button>
                  ) : (
                    <Button variant="outline">Cancel</Button>
                  )}
                </DialogClose>
                {loading ? (
                  <Button variant="destructive" disabled className="bg-red-800">
                    Confirm
                    <Loader2 className="animate-spin" />
                  </Button>
                ) : (
                  <Button variant="destructive" onClick={handleLogout}>
                    Confirm
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Profile;
