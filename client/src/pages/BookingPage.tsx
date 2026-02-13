import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar, Upload } from 'lucide-react';

export const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users, currentUser, addBooking } = useApp();
  
  // const artisan = users.find(u => u.id === id);
  const [formData, setFormData] = useState({
    serviceType: '',
    description: '',
    date: '',
    time: '',
    location: '',
    budget: '',
    specialInstructions: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const booking = {
      id: `booking-${Date.now()}`,
      artisanId: id!,
      clientId: currentUser?._id || 'guest',
      ...formData,
      status: 'pending' as const
    };
    addBooking(booking);
    navigate('/dashboard/client');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Book Service with {artisan?.name}</h1>
          <p className="text-gray-600">Fill out the details below to request a service</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Service Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="serviceType">Service Type *</Label>
                    <Input
                      id="serviceType"
                      required
                      placeholder="e.g., Carpentry, Cabinet Installation"
                      value={formData.serviceType}
                      onChange={e => setFormData({...formData, serviceType: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      required
                      placeholder="Describe the work you need done..."
                      rows={4}
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Preferred Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        required
                        value={formData.date}
                        onChange={e => setFormData({...formData, date: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Preferred Time *</Label>
                      <Input
                        id="time"
                        type="time"
                        required
                        value={formData.time}
                        onChange={e => setFormData({...formData, time: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Service Location *</Label>
                    <Input
                      id="location"
                      required
                      placeholder="Enter your address"
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="budget">Budget *</Label>
                    <Input
                      id="budget"
                      required
                      placeholder="e.g., $500-$1000"
                      value={formData.budget}
                      onChange={e => setFormData({...formData, budget: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="specialInstructions">Special Instructions</Label>
                    <Textarea
                      id="specialInstructions"
                      placeholder="Any additional details..."
                      rows={3}
                      value={formData.specialInstructions}
                      onChange={e => setFormData({...formData, specialInstructions: e.target.value})}
                    />
                  </div>

                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="mb-2">Upload Reference Photos</p>
                    <p className="text-sm text-gray-500 mb-4">Optional - Help artisan understand your needs</p>
                    <Button type="button" variant="outline">Choose Files</Button>
                  </div>

                  <div className="pt-4">
                    <Button type="submit" className="w-full" size="lg">
                      Submit Request
                    </Button>
                    <p className="text-sm text-gray-600 text-center mt-4">
                      The artisan will review your request and respond within 24 hours
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                    {artisan?.avatar && (
                      <img src={artisan.avatar} alt={artisan.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <h3>{artisan?.name}</h3>
                    <p className="text-sm text-gray-600">{artisan?.skills?.[0]}</p>
                    <p className="text-sm">{artisan?.priceRange}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h4 className="mb-3">What happens next?</h4>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li className="flex gap-2">
                    <span>1.</span>
                    <span>Artisan reviews your request</span>
                  </li>
                  <li className="flex gap-2">
                    <span>2.</span>
                    <span>You receive a response within 24h</span>
                  </li>
                  <li className="flex gap-2">
                    <span>3.</span>
                    <span>Discuss details via messaging</span>
                  </li>
                  <li className="flex gap-2">
                    <span>4.</span>
                    <span>Confirm booking and schedule</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
