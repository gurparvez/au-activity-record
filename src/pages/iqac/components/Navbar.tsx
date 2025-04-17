import { ThemeToggle } from '@/components/ui/theme-toggle';
import Profile from '@/components/Profile';
import { NavLink } from 'react-router'; // Updated to 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 shadow-lg bg-background border-b border-border dark:shadow-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8"
              alt="Flowbite Logo"
            />
            <span className="text-2xl font-semibold whitespace-nowrap text-foreground dark:text-foreground">
              AU Activity Record
            </span>
          </NavLink>
          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-muted-foreground rounded-lg md:hidden hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring dark:hover:bg-muted dark:focus:ring-ring"
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
            <ul className="font-medium flex flex-col md:flex-row items-center p-4 md:p-0 mt-4 border border-border rounded-lg bg-card md:bg-transparent md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
              <li>
                <NavLink
                  to="/team/iqac"
                  className="block py-2 px-3 text-foreground rounded-sm md:border-0 md:hover:bg-muted md:p-0 dark:text-foreground md:hover:text-primary md:dark:hover:text-primary dark:hover:text-foreground"
                  // activeClassName="bg-primary text-primary-foreground md:bg-muted md:text-primary"
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/team/iqac/activities"
                  className="block py-2 px-3 text-foreground rounded-sm md:border-0 md:hover:bg-muted md:p-0 dark:text-foreground md:hover:text-primary md:dark:hover:text-primary dark:hover:text-foreground"
                  // activeClassName="bg-primary text-primary-foreground md:bg-muted md:text-primary"
                >
                  Activities
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/team/iqac/users"
                  className="block py-2 px-3 text-foreground rounded-sm md:border-0 md:hover:bg-muted md:p-0 dark:text-foreground md:hover:text-primary md:dark:hover:text-primary dark:hover:text-foreground"
                  // activeClassName="bg-primary text-primary-foreground md:bg-muted md:text-primary"
                >
                  Users
                </NavLink>
              </li>
              <li>
                <ThemeToggle />
              </li>
              <li>
                <Profile />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;