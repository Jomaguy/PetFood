import React, { useState } from 'react';
import Link from 'next/link';
import { Flex } from '../layouts/Flex';
import { Button } from '../atoms/Button';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`w-full bg-white shadow-sm py-4 ${className}`}>
      <Flex className="container mx-auto justify-between items-center px-4">
        <Link href="/" className="text-2xl font-bold text-primary-600">
          PetFood Advisor
        </Link>
        
        {/* Mobile menu button */}
        <Button 
          variant="text" 
          className="md:hidden" 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </Button>
        
        {/* Desktop navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            <li><Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">Home</Link></li>
            <li><Link href="/recommendations" className="text-gray-700 hover:text-primary-600 transition-colors">Recommendations</Link></li>
            <li><Link href="/about" className="text-gray-700 hover:text-primary-600 transition-colors">About</Link></li>
            <li><Link href="/contact" className="text-gray-700 hover:text-primary-600 transition-colors">Contact</Link></li>
          </ul>
        </nav>
      </Flex>
      
      {/* Mobile navigation */}
      {isMenuOpen && (
        <nav className="md:hidden mt-4 px-4">
          <ul className="flex flex-col space-y-4">
            <li><Link href="/" className="block py-2 text-gray-700 hover:text-primary-600 transition-colors">Home</Link></li>
            <li><Link href="/recommendations" className="block py-2 text-gray-700 hover:text-primary-600 transition-colors">Recommendations</Link></li>
            <li><Link href="/about" className="block py-2 text-gray-700 hover:text-primary-600 transition-colors">About</Link></li>
            <li><Link href="/contact" className="block py-2 text-gray-700 hover:text-primary-600 transition-colors">Contact</Link></li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header; 