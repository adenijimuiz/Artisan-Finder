import { Search, CheckCircle, Users, Shield, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';

const categories = [
  { name: 'Carpentry', icon: '🔨', count: 245 },
  { name: 'Plumbing', icon: '🔧', count: 189 },
  { name: 'Electrical', icon: '⚡', count: 156 },
  { name: 'Painting', icon: '🎨', count: 198 },
  { name: 'Mechanics', icon: '🔩', count: 134 },
  { name: 'Masonry', icon: '🧱', count: 112 },
];

const steps = [
  { title: 'Search', description: 'Find artisans by category or location', icon: Search },
  { title: 'Compare', description: 'Check ratings, reviews, and portfolios', icon: Star },
  { title: 'Book', description: 'Request service with your requirements', icon: CheckCircle },
  { title: 'Connect', description: 'Chat directly with your artisan', icon: Users },
];

export const HomePage = () => {

  const {currentUser} = useApp()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl mb-6">Find Skilled Artisans Near You</h1>
            <p className="text-xl mb-8">Connect with verified professionals for all your service needs</p>
            
            <div className="bg-white rounded-lg p-2 flex gap-2">
              <Input 
                placeholder="Search for carpentry, plumbing, electrical..." 
                className="flex-1 border-0 text-black"
              />
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Search className="mr-2 h-5 w-5" />
                Search
              </Button>
            </div>

            <div className="mt-6 flex justify-center gap-4">

              {
                currentUser ? 
                
                <Link to="/search">
                  <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
                    Find an Artisan
                  </Button>
                </Link>
                
                :
                <Link to="/register/client">
                  <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
                    Find an Artisan
                  </Button>
                </Link>
              }
              
              <Link to="/register/artisan">
                <Button size="lg" variant="outline" className="bg-blue-700 text-white hover:bg-blue-600 border-white">
                  Register as Artisan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl text-center mb-12">Browse by Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link key={category.name} to={`/search?category=${category.name}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h3 className="mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.count} artisans</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={step.title} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-2xl text-blue-600 mb-2">{idx + 1}</div>
                <h3 className="text-xl mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl mb-2">Verified Artisans</h3>
              <p className="text-gray-600">All artisans go through identity and skill verification</p>
            </div>
            <div>
              <Star className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl mb-2">Trusted Reviews</h3>
              <p className="text-gray-600">Real reviews from verified customers</p>
            </div>
            <div>
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl mb-2">10,000+ Users</h3>
              <p className="text-gray-600">Join thousands of satisfied clients and artisans</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
