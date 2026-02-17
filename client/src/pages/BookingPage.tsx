import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar, Upload, Loader2 } from 'lucide-react';
import { bookingsAPI } from '@/services/api';
// import { bookingsAPI } from '@/api/bookings'; // adjust path

export const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, addBooking } = useApp();

  const [formData, setFormData] = useState({
    artisanId: id,
    serviceType: '',
    description: '',
    date: '',
    time: '',
    location: '',
    budget: '',
    specialInstructions: '',
  });

  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setIsSubmitting(true);

  try {
    const payload = new FormData();

    // Append all text fields from your React state
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        payload.append(key, value);
      }
    });

    // Append images
    images.forEach((file) => payload.append("images", file));

    await bookingsAPI.createBooking(payload);

    // addBooking(response.data.booking);
    navigate("/dashboard/client", {
      state: { success: "Booking created successfully!" },
    });
  } catch (err: any) {
    setError(err.response?.data?.message || "Failed to create booking.");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Book Service</h1>
          <p className="text-gray-600">Fill out the details below to request a service</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Existing form fields remain the same */}
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

              {/* Image upload section */}
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="mb-2">Upload Reference Photos</p>
                <p className="text-sm text-gray-500 mb-4">
                  Optional - Help the artisan understand your needs
                </p>
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('images')?.click()}
                >
                  Choose Files
                </Button>
                {images.length > 0 && (
                  <p className="mt-2 text-sm text-green-600">
                    {images.length} file(s) selected
                  </p>
                )}
              </div>

              {/* Error display */}
              {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
              )}

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </Button>
                <p className="text-sm text-gray-600 text-center mt-4">
                  The artisan will review your request and respond within 24 hours
                </p>
              </div>
            </form>
          </CardContent>
        </Card> 
      </div>
    </div>
  );
};