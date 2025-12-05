import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { Search, Filter } from 'lucide-react';
import PlantCard from '../components/PlantCard';
import FilterSidebar from '../components/FilterSidebar';
import { AnimatePresence, motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import PlantDetailsModal from '../components/PlantDetailsModal';
import ErrorPage from '../components/ErrorPage';

const fetchPlants = async () => {
  const response = await api.get('/plants');
  return response.data;
};

const ShopPage = () => {
  const { data: plants, isLoading, error } = useQuery({
    queryKey: ['plants'],
    queryFn: fetchPlants,
  });

  const [selectedPlant, setSelectedPlant] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false);

  const [filters, setFilters] = React.useState({
    categories: [],
    light: [],
    difficulty: [],
    petFriendly: []
  });

  const clearFilters = () => {
    setFilters({
      categories: [],
      light: [],
      difficulty: [],
      petFriendly: []
    });
    setSearchTerm('');
  };

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
    if (!plants || !Array.isArray(plants)) {
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
    <div className="flex flex-col w-full relative">
      <HeroSection />
      <div className="flex w-full container mx-auto relative">
        {/* Desktop Sidebar */}
        <FilterSidebar 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          onClearFilters={clearFilters}
          className="hidden md:block w-64 sticky top-20 self-start rounded-r-xl"
        />

        {/* Mobile Filter Drawer */}
        <AnimatePresence>
          {isMobileFilterOpen && (
            <>
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileFilterOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
              />
              <motion.div
                key="drawer"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 z-50 w-80 md:hidden"
              >
                <FilterSidebar 
                  filters={filters} 
                  onFilterChange={handleFilterChange} 
                  onClearFilters={clearFilters}
                  onClose={() => setIsMobileFilterOpen(false)}
                  className="h-full w-full"
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="flex-grow p-6 md:p-12">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div className="flex items-center justify-between w-full md:w-auto">
              <h2 id="shop-collection" className="text-4xl md:text-5xl font-serif font-bold text-primary scroll-mt-24">Our Collection</h2>
              <button 
                onClick={() => setIsMobileFilterOpen(true)}
                className="md:hidden flex items-center gap-2 text-gray-600 hover:text-primary bg-white px-5 py-3 rounded-full shadow-md border border-gray-200 hover:border-primary transition-all"
              >
                <Filter size={20} />
                <span className="font-semibold">Filters</span>
              </button>
            </div>
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search plants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-gray-700"
              />
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            </div>
          </div>
          <p className="text-gray-500 mb-8 text-lg">{filteredPlants.length} plants available</p>
          
          {/* Category Pills */}
          <div className="flex flex-wrap gap-3 mb-10">
            <button 
              onClick={() => setFilters(prev => ({ ...prev, categories: [] }))}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                filters.categories.length === 0 
                  ? 'bg-primary text-white shadow-lg' 
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary'
              }`}
            >
              All Plants
            </button>
            {['Air Purifying', 'Succulents', 'Flowering'].map((category) => (
              <button 
                key={category}
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  categories: prev.categories.includes(category) ? [] : [category] 
                }))}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  filters.categories.includes(category)
                    ? 'bg-primary text-white shadow-lg' 
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {filteredPlants.length === 0 ? (
            <p className="text-gray-500 text-lg">No plants match your selected filters.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
