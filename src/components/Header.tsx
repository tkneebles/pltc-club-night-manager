import React from 'react';
import { Tent as Tennis } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-[#0C2340] text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Tennis size={28} className="mr-2 text-[#78B43C]" />
          <h1 className="text-2xl font-bold">CourtManager</h1>
        </div>
        <div className="text-sm text-gray-300">
          Efficiently manage your tennis courts
        </div>
      </div>
    </header>
  );
};

export default Header;