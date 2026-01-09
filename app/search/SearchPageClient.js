'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Loader2, Search, MapPin, X } from 'lucide-react';
import Fuse from 'fuse.js';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Debounce hook
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function SearchPageClient() {
  const [businesses, setBusinesses] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCoords, setUserCoords] = useState(null);
  const [userLocation, setUserLocation] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [maxDistance, setMaxDistance] = useState(50);

  const debouncedQuery = useDebounce(searchQuery, 300);

  // Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const fetchBusinesses = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const { data, error } = await supabase.from('businesses').select('*');
      if (error) throw error;
      setBusinesses(data || []);
      setResults(data || []);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load businesses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation not supported.');
      fetchBusinesses();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ latitude, longitude });
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=en`
          );
          const data = await res.json();
          const location =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.county ||
            '';
          setUserLocation(location);
        } catch (err) {
          console.error(err);
        }
        fetchBusinesses();
      },
      (err) => {
        console.error(err);
        setErrorMsg('Location permission denied. Showing all businesses.');
        fetchBusinesses();
      }
    );
  }, []);

  // Robust search + filter
  // Inside useEffect for search + filter
useEffect(() => {
  let filtered = [...businesses];

  // Normalize types
  filtered = filtered.map((b) => ({
    ...b,
    typeArray: b.type
      ? b.type.split(',').map((t) => t.trim().toLowerCase())
      : []
  }));

  // Fuse.js search
  if (debouncedQuery.trim()) {
    const query = debouncedQuery.toLowerCase();
    const fuse = new Fuse(filtered, {
      keys: ['business_name', 'address', 'typeArray'],
      threshold: 0.3
    });
    filtered = fuse.search(query).map((res) => res.item);
  }

  // Type filter (dropdown)
  if (selectedType !== 'all') {
    const selType = selectedType.toLowerCase();
    filtered = filtered.filter((b) => b.typeArray.includes(selType));
  }

  // Distance filter
  if (userCoords) {
    filtered = filtered
      .map((b) => ({
        ...b,
        distance:
          b.latitude && b.longitude
            ? calculateDistance(
                userCoords.latitude,
                userCoords.longitude,
                b.latitude,
                b.longitude
              )
            : null
      }))
      .filter((b) => b.distance === null || b.distance <= maxDistance)
      .sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
  }

  setResults(filtered);
}, [businesses, debouncedQuery, selectedType, maxDistance, userCoords]);


  const types = ['all', ...new Set(businesses.map((b) => b.type).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Discover Businesses Near You
          </h1>
          {userLocation && (
            <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4" />
              {userLocation}
            </p>
          )}
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, type, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t === 'all' ? 'All Types' : t}
              </option>
            ))}
          </select>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading businesses...</p>
          </div>
        ) : results.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {results.map((b) => (
                <motion.a
                  key={b.id}
                  href={`/site/${b.slug}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  layout
                  className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative mb-4">
                    <Image
                      height={250}
                      width={250}
                      src={b.logo || '/placeholder.png'}
                      alt={b.business_name}
                      className="w-20 h-20 object-cover rounded-full mx-auto ring-4 ring-gray-100 dark:ring-gray-700 group-hover:ring-indigo-500 transition-all"
                    />
                    {typeof b.distance === 'number' && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">
                        {b.distance.toFixed(1)} km away
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-center mb-2 text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                    {b.business_name}
                  </h3>
                  <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-1">{b.type}</p>
                  {b.address && (
                    <p className="text-xs text-center text-gray-400 dark:text-gray-500 line-clamp-2">
                      <MapPin className="w-3 h-3 inline mr-1" />
                      {b.address}
                    </p>
                  )}
                </motion.a>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No businesses found. Try different search terms or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
