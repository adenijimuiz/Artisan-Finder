import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, DollarSign, Clock, Star, MessageCircle, ArrowLeft, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const BookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookings, users, currentUser, updateBooking } = useApp();
  // const [feedback, setFeedback] = useState('');
  // const [showFeedback, setShowFeedback] = useState(false);
console.log(users)

  const booking = bookings.find(b => b._id === id);
  const artisan = booking ? users.find(u => u.id === booking.artisanId) : null;
  // const client = booking ? users.find(u => u.id === booking.clientId) : null;
  console.log('Booking', booking)
  console.log('Artisan', artisan)
  // console.log('Client', client)

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">Booking not found</p>
            <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // const isArtisan = currentUser?.id === booking.artisanId;
  // const isClient = currentUser?.id === booking.clientId;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      default: return null;
    }
  };

  const handleStatusUpdate = (newStatus: string) => {
    updateBooking(booking._id, { status: newStatus });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold mb-2">Booking Details</h1>
            <p className="text-gray-600">Booking ID: {booking._id}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Status</CardTitle>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    <span className="capitalize font-semibold">{booking.status}</span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Service Details */}
            <Card>
              <CardHeader>
                <CardTitle>Service Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-600 block mb-2">Service Type</label>
                  <p className="text-lg text-gray-900">{booking.serviceType}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 block mb-2">Description</label>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{booking.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <Calendar className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Date</label>
                      <p className="text-gray-900">{booking.date}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Clock className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Time</label>
                      <p className="text-gray-900">{booking.time || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Location</label>
                      <p className="text-gray-900">{booking.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <DollarSign className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Budget</label>
                      <p className="text-gray-900">${booking.budget || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                {booking.specialInstructions && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <label className="text-sm font-semibold text-gray-600 block mb-2">Special Instructions</label>
                    <p className="text-gray-700">{booking.specialInstructions}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {/* {isArtisan && booking.status === 'pending' && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6 space-y-4">
                  <p className="text-sm text-gray-600">You can accept or decline this booking request</p>
                  <div className="flex gap-4">
                    <Button 
                      onClick={() => handleStatusUpdate('accepted')}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Accept Booking
                    </Button>
                    <Button 
                      onClick={() => handleStatusUpdate('cancelled')}
                      variant="outline"
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Decline
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {isClient && booking.status !== 'completed' && booking.status !== 'cancelled' && (
              <Card className="bg-red-50 border-red-200">
                <CardContent className="pt-6">
                  <Button 
                    onClick={() => handleStatusUpdate('cancelled')}
                    variant="outline"
                    className="w-full text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel Booking
                  </Button>
                </CardContent>
              </Card>
            )} */}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Artisan Info */}
            <Card>
              <CardHeader>
                <CardTitle>Artisan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {booking?.artisan?.name}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{booking?.artisan?.name}</h3>
                    <p className="text-sm text-gray-600">{booking?.artisan?.email}</p>
                    {booking?.artisan?.verified && (
                      <Badge className="mt-2 bg-blue-100 text-blue-800">Verified</Badge>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4 space-y-3">
                  {/* {artisan.rating && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{artisan.rating}</span>
                        <span className="text-sm text-gray-600">({artisan.reviewCount || 0})</span>
                      </div>
                    </div>
                  )} */}
                  {booking?.artisan?.phone && (
                    <div>
                      <span className="text-sm text-gray-600">Phone</span>
                      <p className="font-medium">{booking?.artisan?.phone}</p>
                    </div>
                  )}
                  {booking?.artisan?.location && (
                    <div>
                      <span className="text-sm text-gray-600">Location</span>
                      <p className="font-medium">{booking?.artisan?.location}</p>
                    </div>
                  )}
                  {booking?.artisan?.experience && (
                    <div>
                      <span className="text-sm text-gray-600">Experience</span>
                      <p className="font-medium">{booking?.artisan?.experience}</p>
                    </div>
                  )}
                </div>

                <Button className="w-full" variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
              </CardContent>
            </Card>

            {/* Client Info */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Client</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {client.name[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{client.name}</h3>
                    <p className="text-sm text-gray-600">{client.email}</p>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-3">
                  {client.phone && (
                    <div>
                      <span className="text-sm text-gray-600">Phone</span>
                      <p className="font-medium">{client.phone}</p>
                    </div>
                  )}
                  {client.location && (
                    <div>
                      <span className="text-sm text-gray-600">Location</span>
                      <p className="font-medium">{client.location}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Timeline / Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      <div className="w-0.5 h-12 bg-gray-200"></div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Booking Created</p>
                      <p className="text-xs text-gray-600">Today</p>
                    </div>
                  </div>

                  {['accepted', 'in-progress', 'completed'].includes(booking.status) && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                        <div className="w-0.5 h-12 bg-gray-200"></div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Accepted</p>
                        <p className="text-xs text-gray-600">Soon</p>
                      </div>
                    </div>
                  )}

                  {['completed'].includes(booking.status) && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Completed</p>
                        <p className="text-xs text-gray-600">Soon</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card> */
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;
