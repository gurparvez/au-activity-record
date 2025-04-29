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

import { account, myAppwrite } from '@/api/appwrite';
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
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Models } from 'appwrite';

const Profile = () => {
  const navigate = useNavigate();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [updateNameLoading, setUpdateNameLoading] = useState(false);
  const [departmentLoading, setDepartmentLoading] = useState(false);
  const [user, setUser] = useState<Models.User<{}> | null>(null);
  const [Role, setRole] = useState('');
  const [userDepartment, setUserDepartment] = useState<Models.Document | null>(null);
  const [nameInput, setNameInput] = useState('');

  const getUser = async () => {
    try {
      setUserLoading(true);
      const user = await account.get();
      // console.log('User fetched:', user);
      setUser(user);
      setNameInput(user.name);
      return user; // Return user to use in getDepartment
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setUser(null);
      return null;
    } finally {
      setUserLoading(false);
    }
  };

  // Function to fetch department data
  const getRoleAndDepartment = async (userId: string) => {
    try {
      setDepartmentLoading(true);
      const userRole = await myAppwrite.getUserRole(userId);
      const userDepartment = await myAppwrite.getUserDepartment(userId);

      // console.log('User Role: ', userRole);
      // console.log('Department fetched:', userDepartment);

      setRole(userRole!.role);
      setUserDepartment(userDepartment);
    } catch (error) {
      console.error('Failed to fetch department:', error);
      setUserDepartment(null);
    } finally {
      setDepartmentLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUser(); // Fetch user first
      if (user) {
        await getRoleAndDepartment(user.$id); // Fetch role and department only if user exists
      }
    };
    fetchData();
  }, [account, myAppwrite]);

  const handleUpdateName = async () => {
    if (!user || !nameInput.trim()) return; // Prevent update if no user or empty name
    try {
      setUpdateNameLoading(true);
      await account.updateName(nameInput.trim());
      setUser({ ...user, name: nameInput.trim() }); // Update local user state
      console.log('Name updated successfully');
    } catch (error) {
      console.error('Failed to update name:', error);
      // Revert nameInput to user.name on error
      setNameInput(user.name);
    } finally {
      setUpdateNameLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await account.deleteSession('current');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Profile</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>
            Update your name here. Email and department are read-only.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4 mx-4">
          {/* Name Field (Editable) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            {userLoading ? (
              <div className="col-span-3 flex items-center">
                <Loader2 className="animate-spin mr-2" size={16} />
                Loading...
              </div>
            ) : user ? (
              <Input
                id="name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="col-span-3"
                disabled={updateNameLoading}
              />
            ) : (
              <div className="col-span-3 text-red-500">Unable to load name</div>
            )}
          </div>

          {/* Email Field (Read-only) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            {userLoading ? (
              <div className="col-span-3 flex items-center">
                <Loader2 className="animate-spin mr-2" size={16} />
                Loading...
              </div>
            ) : user ? (
              <Input id="email" value={user.email} className="col-span-3" disabled />
            ) : (
              <div className="col-span-3 text-red-500">Unable to load email</div>
            )}
          </div>

          {/* Role Field (Read-only) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            {departmentLoading ? (
              <div className="col-span-3 flex items-center">
                <Loader2 className="animate-spin mr-2" size={16} />
                Loading...
              </div>
            ) : Role ? (
              <Input id="role" value={Role} className="col-span-3" disabled />
            ) : (
              <div className="col-span-3 text-red-500">No role assigned</div>
            )}
          </div>

          {/* Department Field (Read-only) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">
              Department
            </Label>
            {departmentLoading ? (
              <div className="col-span-3 flex items-center">
                <Loader2 className="animate-spin mr-2" size={16} />
                Loading...
              </div>
            ) : userDepartment ? (
              <Input id="department" value={userDepartment.name} className="col-span-3" disabled />
            ) : (
              <div className="col-span-3 text-red-500">No department found</div>
            )}
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button
              type="submit"
              onClick={handleUpdateName}
              disabled={updateNameLoading || !nameInput.trim() || userLoading}
            >
              {updateNameLoading ? (
                <>
                  Saving... <Loader2 className="animate-spin ml-2" size={16} />
                </>
              ) : (
                'Save changes'
              )}
            </Button>
          </SheetClose>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" disabled={logoutLoading}>
                Logout
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Logout</DialogTitle>
                <DialogDescription>Are you sure you want to logout?</DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2 mt-4">
                <DialogClose asChild>
                  <Button variant="outline" disabled={logoutLoading}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button variant="destructive" onClick={handleLogout} disabled={logoutLoading}>
                  {logoutLoading ? (
                    <>
                      Logging out... <Loader2 className="animate-spin ml-2" size={16} />
                    </>
                  ) : (
                    'Confirm'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Profile;
