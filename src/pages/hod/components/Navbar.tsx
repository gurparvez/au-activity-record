import { useState } from 'react';
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

const navLinks = [
  { name: 'Home', path: '/' },
];

const Navbar: React.FC = () => {
  return (
    <nav className="border-b shadow-md fixed w-full z-10 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Title */}
          <NavLink to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Logo" />
            <span className="text-2xl font-semibold whitespace-nowrap text-foreground">
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
                  `hover:text-blue-400 transition ${isActive ? 'text-blue-500 font-medium' : ''}`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <ThemeToggle />
            <Profile />
          </div>

          {/* Mobile Dropdown Menu */}
          <div className="md:hidden flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none">
                  <svg
                    className="h-6 w-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
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
                    <NavLink to={link.path} className="w-full px-2 py-1 rounded hover:bg-muted">
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
                <DropdownMenuItem asChild>
                  <div className="w-full">
                    <Profile />
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
