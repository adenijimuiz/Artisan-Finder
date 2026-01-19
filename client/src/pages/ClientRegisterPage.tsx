import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';

export const ClientRegisterPage = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useApp();
  const [CurrentState, setCurrentState] = useState('Registers')
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
      id: `client-${Date.now()}`,
      ...formData,
      role: 'client' as const
    };
    setCurrentUser(newUser);
    navigate('/dashboard/client');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-md">
        <Card>

          {
            CurrentState === 'Register' ? (
              <CardHeader>
                <CardTitle className="text-2xl">Create Your Account</CardTitle>
                <p className="text-gray-600">Join to find skilled artisans</p>
              </CardHeader>
            ) : (
              <CardHeader>
                <CardTitle className="text-2xl text-center">Log in</CardTitle>
                <p className="text-gray-600">Let find our right skilled artisans</p>
              </CardHeader>
            )
          }
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">

              {
                CurrentState === 'Register' && (
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                )
              }
              
              
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
              
              {CurrentState === 'Register' && (
                <>
                  <div>
                    <Label htmlFor="phone">Phone Number (optional)</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location (optional)</Label>
                    <Input
                      id="location"
                      placeholder="e.g., New York, NY"
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
              </>)}

              <Button type="submit" className="w-full">{CurrentState === 'Register' ? 'Register' : 'Log In'}</Button>


                {
                  CurrentState === 'Register' ?

                  <div className="text-center text-sm text-gray-600">
                Already have an account? <span onClick={() => setCurrentState('Login')} className="text-blue-600 cursor-pointer">Login</span>
              </div> : 

              <div className="text-center text-sm text-gray-600">
                Don't have an account? <span onClick={() => setCurrentState('Register')} className="text-blue-600 cursor-pointer">Register</span>
              </div>

                }
              
            </form>

            {/* <div className="mt-6 pt-6 border-t">
              <p className="text-center text-sm text-gray-600 mb-4">Or continue with</p>
              <div className="space-y-2">
                <Button type="button" variant="outline" className="w-full">
                  Continue with Google
                </Button>
                <Button type="button" variant="outline" className="w-full">
                  Continue with Facebook
                </Button>
              </div>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
