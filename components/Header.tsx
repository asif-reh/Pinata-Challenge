"use client"

import { useState } from 'react';
import Link from 'next/link';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { setTheme, theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background shadow-md">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          CreativeHub
        </Link>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            Menu
          </Button>
          <div className={`md:flex space-x-4 ${isMenuOpen ? 'block' : 'hidden'}`}>
            <Link href="/projects" className="hover:text-primary">
              Projects
            </Link>
            <Link href="/collaborate" className="hover:text-primary">
              Collaborate
            </Link>
            <Link href="/profile" className="hover:text-primary">
              Profile
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}