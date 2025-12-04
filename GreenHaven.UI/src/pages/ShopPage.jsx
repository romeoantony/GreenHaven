import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { Search } from 'lucide-react';
import PlantCard from '../components/PlantCard';
import FilterSidebar from '../components/FilterSidebar';
import { AnimatePresence } from 'framer-motion';

const fetchPlants = async () => {
  const response = await api.get('/plants');
  return response.data;
};

import HeroSection from '../components/HeroSection';

import PlantDetailsModal from '../components/PlantDetailsModal';
import ErrorPage from '../components/ErrorPage';

const ShopPage = () => {
  const { data: plants, isLoading, error } = useQuery({
    queryKey: ['plants'],
    queryFn: fetchPlants,
  });

  const [selectedPlant, setSelectedPlant] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');

  const [filters, setFilters] = React.useState({
    categories: [],
    light: [],
    difficulty: [],
    petFriendly: []
  });

  const handleFilterChange = (section, value) => {
    setFilters(prev => {
      const current = prev[section];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [section]: updated };
    });
  };

  const filteredPlants = React.useMemo(() => {
    if (!Array.isArray(plants)) {
      console.log('Plants data is not an array:', plants);
      return [];
    }
    return plants.filter(plant => {
      // Search Filter
      if (searchTerm && !plant.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;

      // Category Filter (Match by Name)
      if (filters.categories.length > 0 && !filters.categories.includes(plant.category?.name)) return false;
      
      // Light Filter
      const lightMap = { 0: 'Low', 1: 'Indirect', 2: 'Direct' };
      const difficultyMap = { 0: 'Beginner', 1: 'Intermediate', 2: 'Expert' };
      
      const plantLight = lightMap[plant.lightRequirement];
      if (filters.light.length > 0 && !filters.light.includes(plantLight)) return false;

      const plantDifficulty = difficultyMap[plant.difficulty];
      if (filters.difficulty.length > 0 && !filters.difficulty.includes(plantDifficulty)) return false;

      // Pet Friendly Filter
      if (filters.petFriendly.includes('Pet Friendly') && !plant.isPetFriendly) return false;

      return true;
    });
  }, [plants, filters, searchTerm]);

  if (isLoading) return <div className="text-center mt-10">Loading plants...</div>;
  if (error) return (
    <ErrorPage 
      title="Unable to Load Plants" 
      message="We couldn't fetch the plant collection. This might be due to a network issue or server maintenance."
      showRetryButton={true}
      onRetry={() => window.location.reload()}
    />
  );

  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <div className="flex w-full container mx-auto">
        <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
        <div className="flex-grow p-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-3xl font-serif font-bold text-primary">Our Collection ({filteredPlants.length})</h2>
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search plants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>
          {filteredPlants.length === 0 ? (
            <p className="text-gray-500 text-lg">No plants match your selected filters.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlants.map((plant) => (
                <PlantCard 
                  key={plant.id} 
                  plant={plant} 
                  onClick={setSelectedPlant}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Plant Details Modal */}
      <AnimatePresence>
        {selectedPlant && (
          <PlantDetailsModal 
            plant={selectedPlant} 
            onClose={() => setSelectedPlant(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShopPage;
