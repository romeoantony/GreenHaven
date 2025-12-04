import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';

const FilterSection = ({ title, options, selected, onChange, isOpen, toggle }) => (
  <div className="border-b border-gray-100 py-4">
    <button 
      className="flex justify-between items-center w-full text-left mb-2 group"
      onClick={toggle}
    >
      <span className="font-serif font-semibold text-primary group-hover:text-highlight transition-colors">{title}</span>
      {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
    </button>
    
    {isOpen && (
      <div className="space-y-2 mt-2 pl-1">
        {options.map((option, idx) => (
          <label key={idx} className="flex items-center space-x-3 cursor-pointer group">
            <div className="relative flex items-center">
              <input 
                type="checkbox" 
                checked={selected.includes(option)}
                onChange={() => onChange(option)}
                className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 transition-all checked:border-primary checked:bg-primary hover:border-highlight"
              />
              <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <span className="text-gray-600 group-hover:text-primary transition-colors text-sm">{option}</span>
          </label>
        ))}
      </div>
    )}
  </div>
);

const FilterSidebar = ({ filters, onFilterChange }) => {
  const [sections, setSections] = useState({
    categories: true,
    light: true,
    difficulty: false,
    petFriendly: false
  });

  const toggleSection = (section) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="w-64 bg-white p-6 shadow-sm h-full hidden md:block border-r border-gray-100 sticky top-20 self-start rounded-r-xl">
      <div className="flex items-center gap-2 mb-6 text-primary border-b border-gray-100 pb-4">
        <Filter size={20} />
        <h2 className="text-xl font-serif font-bold">Filters</h2>
      </div>
      
      <FilterSection 
        title="Categories" 
        options={['Air Purifying', 'Succulents', 'Flowering']} 
        selected={filters.categories}
        onChange={(val) => onFilterChange('categories', val)}
        isOpen={sections.categories}
        toggle={() => toggleSection('categories')}
      />
      
      <FilterSection 
        title="Light Requirements" 
        options={['Low', 'Indirect', 'Direct']} 
        selected={filters.light}
        onChange={(val) => onFilterChange('light', val)}
        isOpen={sections.light}
        toggle={() => toggleSection('light')}
      />

      <FilterSection 
        title="Difficulty" 
        options={['Beginner', 'Intermediate', 'Expert']} 
        selected={filters.difficulty}
        onChange={(val) => onFilterChange('difficulty', val)}
        isOpen={sections.difficulty}
        toggle={() => toggleSection('difficulty')}
      />

      <FilterSection 
        title="Special" 
        options={['Pet Friendly']} 
        selected={filters.petFriendly}
        onChange={(val) => onFilterChange('petFriendly', val)}
        isOpen={sections.petFriendly}
        toggle={() => toggleSection('petFriendly')}
      />
    </div>
  );
};

export default FilterSidebar;
