import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Calendar, Star, CreditCard } from 'lucide-react';

export const ClientDashboard = () => {
  const { currentUser, bookings, users, getFavoriteArtisans } = useApp();
  
  const myBookings = bookings.filter(b => b.clientId === currentUser?.id);
  const favoriteIds = getFavoriteArtisans();
  const favoriteArtisans = users.filter(u => favoriteIds.includes(u.id));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Welcome back, {currentUser?.name}!</h1>
          <p className="text-gray-600">Manage your bookings and requests</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-gray-600">Active Bookings</p>
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl">{myBookings.filter(b => b.status === 'pending' || b.status === 'accepted').length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-gray-600">Completed</p>
                <Star className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl">{myBookings.filter(b => b.status === 'completed').length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-gray-600">Favorites</p>
                <Heart className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-3xl">{favoriteArtisans.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-gray-600">Total Spent</p>
                <CreditCard className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-3xl">$1,800</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="bookings" className="space-y-4">
          <TabsList>
            <TabsTrigger value="bookings">Active Bookings</TabsTrigger>
            <TabsTrigger value="history">Request History</TabsTrigger>
            <TabsTrigger value="favorites">Favorite Artisans</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {myBookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled').length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No active bookings</p>
                ) : (
                  <div className="space-y-4">
                    {myBookings
                      .filter(b => b.status !== 'completed' && b.status !== 'cancelled')
                      .map(booking => {
                        const artisan = users.find(u => u.id === booking.artisanId);
                        return (
                          <div key={booking.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-semibold">{booking.serviceType}</h3>
                                <p className="text-sm text-gray-600">Artisan: {artisan?.name}</p>
                              </div>
                              <Badge>{booking.status}</Badge>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>📅 {booking.date} at {booking.time}</p>
                              <p>📍 {booking.location}</p>
                              <p>💰 {booking.budget}</p>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button size="sm">Message Artisan</Button>
                              <Button size="sm" variant="outline">View Details</Button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Request History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myBookings.map(booking => {
                    const artisan = users.find(u => u.id === booking.artisanId);
                    return (
                      <div key={booking.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">{booking.serviceType}</h3>
                            <p className="text-sm text-gray-600">Artisan: {artisan?.name}</p>
                          </div>
                          <Badge variant={booking.status === 'completed' ? 'default' : 'secondary'}>
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>📅 {booking.date}</p>
                          <p>💰 {booking.budget}</p>
                        </div>
                        {booking.status === 'completed' && (
                          <Button size="sm" variant="outline" className="mt-4">Leave Review</Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>Favorite Artisans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {favoriteArtisans.map(artisan => (
                    <div key={artisan.id} className="border rounded-lg p-4">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                          {artisan.avatar && (
                            <img src={artisan.avatar} alt={artisan.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3>{artisan.name}</h3>
                          <p className="text-sm text-gray-600">{artisan.skills?.[0]}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{artisan.rating}</span>
                          </div>
                        </div>
                        <Button size="sm">Book</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p>Plumbing Service</p>
                        <p className="text-sm text-gray-600">Jan 10, 2026</p>
                      </div>
                      <p className="font-semibold">$300</p>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p>Carpentry Work</p>
                        <p className="text-sm text-gray-600">Dec 28, 2025</p>
                      </div>
                      <p className="font-semibold">$1,500</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}