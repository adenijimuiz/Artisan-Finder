import { useParams, Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  MapPin,
  Award,
  Calendar,
  MessageSquare
} from "lucide-react";
import { usersAPI } from "@/services/api";
import { useEffect, useState } from "react";

export interface Artisan {
    _id: string;
    name: string;
    email: string;
    role: "artisan";
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

export const ArtisanProfilePage = () => {
  
  const { id } = useParams();
  const { users, reviews } = useApp();
  const [artisan, setArtisan] = useState<Artisan | null>(null);

  const getArtisan = async (params: string) => {
    try {
      const response = await usersAPI.getArtisan(params);
      setArtisan(response.data.artisan);
    } catch (error) {
      console.error("Error fetching artisan:", error);
    }
  };

  useEffect(() => {
    if (id) {
      getArtisan(id);
    }
  }, [id]);

  if (!artisan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Artisan not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto p-8">
          <div className="flex gap-6">
            <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden">
              {artisan.avatar && (
                <img
                  src={artisan.avatar}
                  alt={artisan.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-3xl mb-2">{artisan.name}</h1>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xl">{artisan.rating}</span>
                    </div>
                    <span className="text-gray-600">
                      ({artisan.reviewCount} reviews)
                    </span>
                    {artisan.verified && (
                      <Badge variant="secondary">✓ Verified</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{artisan.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl mb-2">{artisan.priceRange}</p>
                  <Badge
                    variant={
                      artisan.availability === "Available"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {artisan.availability}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto p-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <Tabs defaultValue="about" className="space-y-6">
              <TabsList>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="about">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl mb-4">About Me</h3>
                    <p className="text-gray-700 mb-6">{artisan.bio}</p>

                    <h4 className="mb-3">Skills & Expertise</h4>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {artisan.skills?.map((skill) => (
                        <Badge key={skill}>{skill}</Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Experience</p>
                          <p>{artisan.experience}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Availability</p>
                          <p>{artisan.availability}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="portfolio">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl mb-4">Portfolio</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {artisan.portfolio?.map((img, idx) => (
                        <div
                          key={idx}
                          className="aspect-square rounded-lg overflow-hidden bg-gray-200"
                        >
                          <img
                            src={img}
                            alt={`Work ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* <TabsContent value="reviews">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl mb-4">
                      Reviews ({artisanReviews.length})
                    </h3>
                    <div className="space-y-6">
                      {artisanReviews.map((review) => (
                        <div key={review.id} className="border-b pb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <p>{review.clientName}</p>
                            <div className="flex">
                              {Array.from({ length: review.rating }).map(
                                (_, i) => (
                                  <Star
                                    key={i}
                                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                  />
                                ),
                              )}
                            </div>
                          </div>
                          <p className="text-gray-700 mb-1">{review.comment}</p>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent> */}
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <Link to={`/book/${artisan._id}`}>
                  <Button className="w-full mb-3">Book Service</Button>
                </Link>
                <Button variant="outline" className="w-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h4 className="mb-4">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <p>📧 {artisan.email}</p>
                  <p>📞 {artisan.phone}</p>
                  <p>📍 {artisan.location}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
