import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useApp();

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

          <CardHeader>
            <CardTitle className="text-2xl">Log in Admin</CardTitle>
            <p className="text-gray-600">Welcome Back</p>
          </CardHeader>


          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">

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

              <Button type="submit" className="w-full">Log In</Button>

            </form>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};
