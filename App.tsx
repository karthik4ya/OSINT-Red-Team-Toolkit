
import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ToolList } from './components/ToolList';
import { OSINT_TOOLS } from './constants';
import { OsintTool } from './types';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTools = useMemo(() => {
    if (!searchTerm) {
      return OSINT_TOOLS;
    }
    return OSINT_TOOLS.filter(tool =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-900 font-mono text-gray-300">
      <div className="container mx-auto p-4 md:p-8">
        <Header />
        <main>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          {filteredTools.length > 0 ? (
            <ToolList tools={filteredTools} />
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500">No tools found matching your search.</p>
            </div>
          )}
        </main>
        <footer className="text-center mt-12 text-gray-600 text-sm">
          <p>OSINT & Red Team Toolkit | For educational purposes only.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
