import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, FileCheck, AlertCircle, TrendingUp } from 'lucide-react';

export const AdminDashboard = () => {
  const { users, bookings } = useApp();

  const artisans = users.filter(u => u.role === 'artisan');
  const clients = users.filter(u => u.role === 'client');
  const pendingVerification = artisans.filter(a => !a.verified);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl mb-8">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-gray-600">Total Users</p>
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl">{users.length}</p>
              <p className="text-xs text-gray-600 mt-1">
                {artisans.length} artisans • {clients.length} clients
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-gray-600">Pending Verification</p>
                <FileCheck className="w-5 h-5 text-yellow-600" />
              </div>
              <p className="text-3xl">{pendingVerification.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-gray-600">Active Disputes</p>
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-3xl">0</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-gray-600">Total Bookings</p>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl">{bookings.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="verification">Verification Queue</TabsTrigger>
            <TabsTrigger value="disputes">Dispute Resolution</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map(user => (
                    <div key={user._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3>{user.name}</h3>
                            <Badge variant={user.role === 'artisan' ? 'default' : 'secondary'}>
                              {user.role}
                            </Badge>
                            {user.verified && <Badge variant="outline">✓ Verified</Badge>}
                          </div>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          {user.role === 'artisan' && (
                            <p className="text-sm text-gray-600">Skills: {user.skills?.join(', ')}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">View</Button>
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline">Suspend</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification">
            <Card>
              <CardHeader>
                <CardTitle>Pending Verifications ({pendingVerification.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingVerification.map(artisan => (
                    <div key={artisan._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="mb-1">{artisan.name}</h3>
                          <p className="text-sm text-gray-600 mb-1">{artisan.email}</p>
                          <p className="text-sm text-gray-600">Skills: {artisan.skills?.join(', ')}</p>
                          <p className="text-sm text-gray-600">Experience: {artisan.experience}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm">Approve</Button>
                          <Button size="sm" variant="outline">Reject</Button>
                          <Button size="sm" variant="outline">Request More Info</Button>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="border p-2 rounded text-center text-sm">
                          📄 ID Document
                        </div>
                        <div className="border p-2 rounded text-center text-sm">
                          🎓 Certifications
                        </div>
                      </div>
                    </div>
                  ))}
                  {pendingVerification.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No pending verifications</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="disputes">
            <Card>
              <CardHeader>
                <CardTitle>Dispute Resolution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                  <p>No active disputes</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Chart: User growth over time
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Booking Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Pending</span>
                      <span>{bookings.filter(b => b.status === 'pending').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed</span>
                      <span>{bookings.filter(b => b.status === 'completed').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cancelled</span>
                      <span>{bookings.filter(b => b.status === 'cancelled').length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Rated Artisans</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {artisans
                      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                      .slice(0, 5)
                      .map(artisan => (
                        <div key={artisan._id} className="flex justify-between items-center">
                          <span>{artisan.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-500">★</span>
                            <span>{artisan.rating}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Chart: Popular service categories
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
