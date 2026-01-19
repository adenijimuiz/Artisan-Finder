import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, MapPin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SearchPage = () => {
  const { users, toggleFavorite, getFavoriteArtisans } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  
  const artisans = users.filter(u => u.role === 'artisan');
  const favorites = getFavoriteArtisans();
  
  const filteredArtisans = artisans.filter(artisan => {
    const matchesSearch = artisan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artisan.skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = category === 'all' || artisan.skills?.some(s => s.toLowerCase().includes(category.toLowerCase()));
    return matchesSearch && matchesCategory;
  });

  const sortedArtisans = [...filteredArtisans].sort((a, b) => {
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'reviews') return (b.reviewCount || 0) - (a.reviewCount || 0);
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl mb-8">Find Artisans</h1>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Search by name or skill..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="carpentry">Carpentry</SelectItem>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="painting">Painting</SelectItem>
                  <SelectItem value="mechanic">Mechanics</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4 text-gray-600">
          {sortedArtisans.length} artisans found
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedArtisans.map(artisan => (
            <Card key={artisan.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between mb-4">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                      {artisan.avatar && (
                        <img src={artisan.avatar} alt={artisan.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{artisan.name}</h3>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{artisan.rating}</span>
                        <span className="text-gray-600">({artisan.reviewCount})</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleFavorite(artisan.id)}
                    className="h-8 w-8"
                  >
                    <Heart 
                      className={`w-5 h-5 ${favorites.includes(artisan.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                    />
                  </button>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">{artisan.bio}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {artisan.skills?.slice(0, 3).map(skill => (
                      <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{artisan.location}</span>
                  </div>
                  <p className="text-sm mt-2">{artisan.priceRange}</p>
                </div>

                <div className="flex gap-2">
                  <Link to={`/artisan/${artisan.id}`} className="flex-1">
                    <Button className="w-full">View Profile</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
