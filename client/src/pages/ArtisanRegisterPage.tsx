import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { Upload } from 'lucide-react';

export const ArtisanRegisterPage = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { setCurrentUser } = useApp();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    bio: '',
    skills: '',
    experience: '',
    location: '',
    priceRange: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      const newUser = {
        id: `artisan-${Date.now()}`,
        ...formData,
        role: 'artisan' as const,
        skills: formData.skills.split(',').map(s => s.trim()),
        verified: false,
        rating: 0,
        reviewCount: 0
      };
      setCurrentUser(newUser);
      navigate('/dashboard/artisan');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Register as an Artisan - Step {step} of 3</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <>
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <Label htmlFor="skills">Skills (comma-separated) *</Label>
                    <Input
                      id="skills"
                      placeholder="e.g., Carpentry, Furniture Making, Cabinet Installation"
                      required
                      value={formData.skills}
                      onChange={e => setFormData({...formData, skills: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience">Years of Experience *</Label>
                    <Input
                      id="experience"
                      placeholder="e.g., 5 years"
                      required
                      value={formData.experience}
                      onChange={e => setFormData({...formData, experience: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Professional Bio *</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell clients about your expertise..."
                      required
                      value={formData.bio}
                      onChange={e => setFormData({...formData, bio: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Service Location *</Label>
                    <Input
                      id="location"
                      placeholder="e.g., New York, NY"
                      required
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="priceRange">Price Range (per hour) *</Label>
                    <Input
                      id="priceRange"
                      placeholder="e.g., $50-$100/hr"
                      required
                      value={formData.priceRange}
                      onChange={e => setFormData({...formData, priceRange: e.target.value})}
                    />
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="mb-2">Upload Certifications & ID</p>
                    <p className="text-sm text-gray-500 mb-4">PDF, JPG, PNG (Max 10MB)</p>
                    <Button type="button" variant="outline">Choose Files</Button>
                  </div>
                  
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="mb-2">Upload Portfolio Images</p>
                    <p className="text-sm text-gray-500 mb-4">Show your best work (Up to 10 images)</p>
                    <Button type="button" variant="outline">Choose Images</Button>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Your account will be reviewed within 24-48 hours. You'll receive an email once verified.
                    </p>
                  </div>
                </>
              )}

              <div className="flex justify-between pt-4">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                    Previous
                  </Button>
                )}
                <Button type="submit" className="ml-auto">
                  {step === 3 ? 'Complete Registration' : 'Next'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};