import { NavLink } from 'react-router';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import Profile from '@/components/Profile';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';

const navLinks = [
  { name: 'Home', path: '/team/iqac' },
  { name: 'Activities', path: '/team/iqac/activities' },
  { name: 'Users', path: '/team/iqac/users' },
];

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 shadow-lg bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="https://flowbite.com/docs/images/logo.svg" className="h-6 md:h-8" alt="AU Logo" />
            <span className="text-xl md:text-2xl font-semibold whitespace-nowrap text-foreground">
              AU Activity Record
            </span>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }: { isActive: boolean }) =>
                  `text-foreground hover:text-primary transition ${
                    isActive ? 'text-primary font-medium' : ''
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <ThemeToggle />
            <Profile />
          </div>

          {/* Mobile Menu - shadcn Dropdown */}
          <div className="md:hidden flex items-center space-x-2">
            <Profile onProfileClick={() => setIsDropdownOpen(false)} />
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-2 rounded-md text-muted-foreground hover:bg-muted focus:outline-none"
                  aria-label="Toggle Menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-background mt-2 shadow-lg p-2">
                {navLinks.map((link) => (
                  <DropdownMenuItem key={link.name} asChild>
                    <NavLink
                      to={link.path}
                      className="block w-full px-2 py-1 rounded hover:bg-muted"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {link.name}
                    </NavLink>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <div className="w-full">
                    <ThemeToggle />
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
