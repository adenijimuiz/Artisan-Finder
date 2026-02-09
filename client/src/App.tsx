
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { HomePage } from '@/pages/HomePage';
import { ArtisanRegisterPage } from '@/pages/ArtisanRegisterPage';
import { ClientRegisterPage } from '@/pages/ClientRegisterPage';
import { ArtisanDashboard } from '@/pages/ArtisanDashboard';
import { ClientDashboard } from '@/pages/ClientDashboard';
import { SearchPage } from '@/pages/SearchPage';
import { ArtisanProfilePage } from '@/pages/ArtisanProfilePage';
import { BookingPage } from '@/pages/BookingPage';
import { MessagingPage } from '@/pages/MessagingPage';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { LogOut } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AdminLoginPage } from '@/pages/AdminLoginPage';
import NotFound from '@/pages/NotFound';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Layout = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, setCurrentUser } = useApp();

  // const adminUser = {
  //     id: '1',
  // name: 'ola',
  // email: 'sad',
  // role: 'admin',
  // phone: '12345',
  // avatar: 'non2',
  // bio: 'as',
  // skills: '25',
  // experience: 'asd',
  // location: 'asd',
  // rating: 3,
  // reviewCount: 3,
  // priceRange: 'asd',
  // availability: 'asd',
  // portfolio: 'asd',
  // verified: true,
  // }


  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-2xl text-blue-600">
              ArtisanFinder
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link to="/search" className="hover:text-blue-600">Find Artisans</Link>
              <Link to="/messages" className="hover:text-blue-600">Messages</Link>
              {currentUser?.role === 'admin' && (
                <Link to="/admin" className="hover:text-blue-600">Admin</Link>
              )}
            </div>

            <div className="flex items-center gap-4">
              {currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        {currentUser.name[0]}
                      </div>
                      <span className="hidden md:inline">{currentUser.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/dashboard/${currentUser.role}`} className="w-full cursor-pointer">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCurrentUser(null)} className="cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link to="/register/client">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  {/* <Link to="/register/artisan">
                    <Button>Register</Button>
                  </Link> */}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {children}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl mb-4">ArtisanFinder</h3>
              <p className="text-gray-400">Connecting skilled artisans with clients</p>
            </div>
            <div>
              <h4 className="mb-4">For Clients</h4>
              <div className="space-y-2 text-gray-400">
                <p>Find Artisans</p>
                <p>How It Works</p>
                <p>Safety</p>
              </div>
            </div>
            <div>
              <h4 className="mb-4">For Artisans</h4>
              <div className="space-y-2 text-gray-400">
                <p>Become an Artisan</p>
                <p>Resources</p>
                <p>Success Stories</p>
              </div>
            </div>
            <div>
              <h4 className="mb-4">Company</h4>
              <div className="space-y-2 text-gray-400">
                <p>About Us</p>
                <p>Contact</p>
                <p>Privacy Policy</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            © 2026 ArtisanFinder. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) => {
  const { currentUser } = useApp();

    /// uncomment to enter as an admin
    // const adminUser = {
  //     id: '1',
  // name: 'ola',
  // email: 'sad',
  // role: 'admin',
  // phone: '12345',
  // avatar: 'non2',
  // bio: 'as',
  // skills: '25',
  // experience: 'asd',
  // location: 'asd',
  // rating: 3,
  // reviewCount: 3,
  // priceRange: 'asd',
  // availability: 'asd',
  // portfolio: 'asd',
  // verified: true,
  // }

  // if (!adminUser) {
  //   return <Navigate to="/register/client" />;
  // }

  // if (requiredRole && adminUser.role !== requiredRole) {
  //   return <Navigate to={`/dashboard/${adminUser.role}`} />;
  // }

  if (!currentUser) {
    return <Navigate to="/register/client" />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to={`/dashboard/${currentUser.role}`} />;
  }

  return <>{children}</>;
};

function AppContent() {
  return (
    <>
    <ToastContainer />
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register/artisan" element={<ArtisanRegisterPage />} />
          <Route path="/register/client" element={<ClientRegisterPage />} />
          <Route path="/login/admin" element={<AdminLoginPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/artisan/:id" element={<ArtisanProfilePage />} />
          <Route path="/book/:id" element={<BookingPage />} />
          
          <Route
            path="/dashboard/artisan"
            element={
              <ProtectedRoute requiredRole="artisan">
                <ArtisanDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/client"
            element={
              <ProtectedRoute requiredRole="client">
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <MessagingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
