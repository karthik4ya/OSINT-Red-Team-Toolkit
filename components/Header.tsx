
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center mb-8 md:mb-12">
      <h1 className="text-4xl md:text-5xl font-bold text-green-400 mb-2 tracking-wider">
        OSINT & RED TEAM TOOLKIT
      </h1>
      <p className="text-md md:text-lg text-gray-400 max-w-3xl mx-auto">
        A curated list of powerful tools for Open Source Intelligence, Social Engineering, and Red Team operations. Find, understand, and protect against digital threats.
      </p>
    </header>
  );
};
