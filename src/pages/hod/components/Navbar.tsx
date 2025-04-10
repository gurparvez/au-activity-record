import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { account } from '@/api/appwrite';
import { useNavigate } from 'react-router';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'; // Importing from shadcn/ui
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const Navbar = () => {
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
    <div>
      <nav className="shadow-lg dark:shadow-gray-700/50">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8"
              alt="Flowbite Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              AU Activity Record
            </span>
          </a>
          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col md:flex-row items-center p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
              <li>
                <a
                  href="/team/hod"
                  className="block py-2 px-3 text-gray-900 rounded-sm md:border-0 md:hover:bg-card md:p-0 dark:text-white md:hover:text-gray-400 md:dark:hover:text-gray-400 dark:hover:text-white"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-gray-900 rounded-sm md:border-0 md:hover:bg-card md:p-0 dark:text-white md:hover:text-gray-400 md:dark:hover:text-gray-400 dark:hover:text-white"
                >
                  About
                </a>
              </li>
              <li>
                <ThemeToggle />
              </li>
              <li>
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
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;