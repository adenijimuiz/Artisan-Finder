import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export interface User {
  _id: string;
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


export interface BookingImage {
  url: string;
  publicId: string;
}

export interface Artisan {
  _id: string;
  name: string;
  email: string;
  role: "artisan";
  availability: string;
  avatar: string;
  bio: string;
  experience: string;
  phone: string;
  portfolio: any[];
  priceRange: string;
  rating: number;
  reviewCount: number;
  skills: string[];
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  location: string;
}

export interface Client {
  _id: string;
  name: string;
  email: string;
  role: "client";
  availability: string;
  avatar: string;
  portfolio: any[];
  rating: number;
  reviewCount: number;
  skills: any[];
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  phone: string;
  location: string;
}

export interface Booking {
  _id: string;
  artisan: Artisan;
  client: Client;
  budget: string;
  description: string;
  serviceType: string;
  location: string;
  status: 'pending' | 'accepted' | 'in-progress' | 'rejected' |'completed' | 'cancelled';
  statusHistory: {
    status: string;
    changedAt: string;
  }[];
  specialInstructions: string;
  date: string;
  time: string;
  images: BookingImage[];
  createdAt: string;
  updatedAt: string;
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
  setBookings: (bookings: Booking[]) => void;
  bookings: Booking[];
  setArtisans: (artisans: User) => void;
  artisans: User[]
  reviews: Review[];
  messages: Message[];
  navigate: (path: string) => void;
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
  const [artisans, setArtisans] = useState([]);
  // const [users] = useState<User[]>([...mockArtisans]);
  const [bookings, setBookings] = useState<Booking[] | []>([]);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [favorites, setFavorites] = useState<string[]>([]);
  const navigate = useNavigate();

  const addBooking = (booking: Booking) => {
    setBookings(prev => [...prev, booking]);
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings(prev => prev.map(b => b._id === id ? { ...b, ...updates } : b));
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

   useEffect(() => {
     const token = localStorage.getItem('token');
     const user = localStorage.getItem('user');
     if (token && user) {
       setCurrentUser(JSON.parse(user));
       if (JSON.parse(user)?.role == 'client') {
        navigate('/dashboard/client');
       }else if (JSON.parse(user)?.role == 'artisan') {
        navigate('/dashboard/artisan');
       }else if (JSON.parse(user)?.role == 'admin') {
        navigate('/dashboard/admin');
       }
      //  connectSocket(JSON.parse(user).id);
     }
   }, []);



  return (
    <AppContext.Provider
      value={{
        currentUser,
        // users,
        artisans,
        setArtisans,
        bookings,
        setBookings,
        reviews,
        messages,
        navigate,
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
