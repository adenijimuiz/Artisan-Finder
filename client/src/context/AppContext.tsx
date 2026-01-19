import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'artisan' | 'client' | 'admin';
  phone?: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
  experience?: string;
  location?: string;
  rating?: number;
  reviewCount?: number;
  priceRange?: string;
  availability?: string;
  portfolio?: string[];
  verified?: boolean;
}

export interface Booking {
  id: string;
  artisanId: string;
  clientId: string;
  serviceType: string;
  description: string;
  date: string;
  time: string;
  location: string;
  budget: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  images?: string[];
}

export interface Review {
  id: string;
  artisanId: string;
  clientId: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  bookings: Booking[];
  reviews: Review[];
  messages: Message[];
  setCurrentUser: (user: User | null) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  addReview: (review: Review) => void;
  addMessage: (message: Message) => void;
  getFavoriteArtisans: () => string[];
  toggleFavorite: (artisanId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// Mock data
const mockArtisans: User[] = [
  {
    id: '1',
    name: 'John Carpenter',
    email: 'john@carpenter.com',
    role: 'artisan',
    phone: '+1 234-567-8901',
    avatar: 'https://images.unsplash.com/photo-1629085281900-455f2f1fc5ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjYXJwZW50ZXIlMjB3b29kd29ya2luZ3xlbnwxfHx8fDE3Njg2NTY0NjZ8MA&ixlib=rb-4.1.0&q=80&w=400',
    bio: 'Experienced carpenter with 15+ years of woodworking expertise',
    skills: ['Carpentry', 'Furniture Making', 'Cabinet Installation'],
    experience: '15 years',
    location: 'New York, NY',
    rating: 4.8,
    reviewCount: 124,
    priceRange: '$50-$100/hr',
    availability: 'Available',
    verified: true,
    portfolio: ['https://images.unsplash.com/photo-1707064892275-a3088e8240be?w=400', 'https://images.unsplash.com/photo-1629085281900-455f2f1fc5ab?w=400']
  },
  {
    id: '2',
    name: 'Sarah Plumber',
    email: 'sarah@plumbing.com',
    role: 'artisan',
    phone: '+1 234-567-8902',
    avatar: 'https://images.unsplash.com/photo-1563197906-c1466d8e2edd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbHVtYmVyJTIwZml4aW5nJTIwcGlwZXN8ZW58MXx8fHwxNzY4NTg2MTA1fDA&ixlib=rb-4.1.0&q=80&w=400',
    bio: 'Professional plumber specialized in residential and commercial repairs',
    skills: ['Plumbing', 'Pipe Fitting', 'Emergency Repairs'],
    experience: '10 years',
    location: 'Los Angeles, CA',
    rating: 4.9,
    reviewCount: 98,
    priceRange: '$60-$120/hr',
    availability: 'Available',
    verified: true,
    portfolio: ['https://images.unsplash.com/photo-1563197906-c1466d8e2edd?w=400']
  },
  {
    id: '3',
    name: 'Mike Electric',
    email: 'mike@electric.com',
    role: 'artisan',
    phone: '+1 234-567-8903',
    avatar: 'https://images.unsplash.com/photo-1754620906571-9ba64bd3ffb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2lhbiUyMHdvcmtpbmclMjB3aXJlc3xlbnwxfHx8fDE3Njg2NTY0NjZ8MA&ixlib=rb-4.1.0&q=80&w=400',
    bio: 'Certified electrician with expertise in home and commercial electrical systems',
    skills: ['Electrical Wiring', 'Panel Installation', 'Troubleshooting'],
    experience: '12 years',
    location: 'Chicago, IL',
    rating: 4.7,
    reviewCount: 156,
    priceRange: '$70-$130/hr',
    availability: 'Busy',
    verified: true,
    portfolio: ['https://images.unsplash.com/photo-1754620906571-9ba64bd3ffb4?w=400']
  },
  {
    id: '4',
    name: 'Emma Painter',
    email: 'emma@painting.com',
    role: 'artisan',
    phone: '+1 234-567-8904',
    avatar: 'https://images.unsplash.com/photo-1693342168613-13c88f3ce640?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3VzZSUyMHBhaW50ZXIlMjBpbnRlcmlvcnxlbnwxfHx8fDE3Njg2NTY0Njd8MA&ixlib=rb-4.1.0&q=80&w=400',
    bio: 'Professional painter with an eye for detail and color',
    skills: ['Interior Painting', 'Exterior Painting', 'Color Consultation'],
    experience: '8 years',
    location: 'Miami, FL',
    rating: 4.9,
    reviewCount: 87,
    priceRange: '$40-$80/hr',
    availability: 'Available',
    verified: true,
    portfolio: ['https://images.unsplash.com/photo-1693342168613-13c88f3ce640?w=400']
  },
  {
    id: '5',
    name: 'Alex Mechanic',
    email: 'alex@mechanics.com',
    role: 'artisan',
    phone: '+1 234-567-8905',
    avatar: 'https://images.unsplash.com/photo-1765202663853-5072b1464dd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtZWNoYW5pYyUyMGdhcmFnZXxlbnwxfHx8fDE3Njg2NTY0Njd8MA&ixlib=rb-4.1.0&q=80&w=400',
    bio: 'Experienced auto mechanic specializing in diagnostics and repair',
    skills: ['Auto Repair', 'Diagnostics', 'Maintenance'],
    experience: '20 years',
    location: 'Houston, TX',
    rating: 4.6,
    reviewCount: 203,
    priceRange: '$55-$110/hr',
    availability: 'Available',
    verified: true,
    portfolio: ['https://images.unsplash.com/photo-1765202663853-5072b1464dd3?w=400']
  }
];

const mockBookings: Booking[] = [
  {
    id: 'b1',
    artisanId: '1',
    clientId: 'c1',
    serviceType: 'Carpentry',
    description: 'Need custom kitchen cabinets installed',
    date: '2026-01-25',
    time: '10:00 AM',
    location: 'New York, NY',
    budget: '$1500',
    status: 'pending'
  },
  {
    id: 'b2',
    artisanId: '2',
    clientId: 'c1',
    serviceType: 'Plumbing',
    description: 'Fix leaking bathroom pipes',
    date: '2026-01-20',
    time: '2:00 PM',
    location: 'Los Angeles, CA',
    budget: '$300',
    status: 'completed'
  }
];

const mockReviews: Review[] = [
  {
    id: 'r1',
    artisanId: '1',
    clientId: 'c1',
    clientName: 'Jane Smith',
    rating: 5,
    comment: 'Excellent work! Very professional and on time.',
    date: '2026-01-10'
  },
  {
    id: 'r2',
    artisanId: '1',
    clientId: 'c2',
    clientName: 'Bob Johnson',
    rating: 4,
    comment: 'Great craftsmanship, would recommend.',
    date: '2025-12-15'
  },
  {
    id: 'r3',
    artisanId: '2',
    clientId: 'c3',
    clientName: 'Alice Brown',
    rating: 5,
    comment: 'Fixed the issue quickly and efficiently!',
    date: '2026-01-05'
  }
];

const mockMessages: Message[] = [
  {
    id: 'm1',
    senderId: 'c1',
    receiverId: '1',
    content: 'Hi, I need some carpentry work done',
    timestamp: '2026-01-17T10:00:00',
    read: true
  },
  {
    id: 'm2',
    senderId: '1',
    receiverId: 'c1',
    content: 'Sure! I\'d be happy to help. What kind of work?',
    timestamp: '2026-01-17T10:05:00',
    read: true
  },
  {
    id: 'm3',
    senderId: 'c1',
    receiverId: '1',
    content: 'I need custom kitchen cabinets',
    timestamp: '2026-01-17T10:10:00',
    read: false
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users] = useState<User[]>([...mockArtisans]);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [favorites, setFavorites] = useState<string[]>([]);

  const addBooking = (booking: Booking) => {
    setBookings(prev => [...prev, booking]);
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const addReview = (review: Review) => {
    setReviews(prev => [...prev, review]);
  };

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const getFavoriteArtisans = () => favorites;

  const toggleFavorite = (artisanId: string) => {
    setFavorites(prev =>
      prev.includes(artisanId)
        ? prev.filter(id => id !== artisanId)
        : [...prev, artisanId]
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        bookings,
        reviews,
        messages,
        setCurrentUser,
        addBooking,
        updateBooking,
        addReview,
        addMessage,
        getFavoriteArtisans,
        toggleFavorite
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
