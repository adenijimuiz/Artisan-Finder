import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  MapPin,
  Award,
  Calendar,
  MessageSquare,
  Quote,
} from "lucide-react";
import { reviewsAPI, usersAPI } from "@/services/api";
import { useEffect, useState } from "react";
import type { Artisan } from "@/context/AppContext";

export const ArtisanProfilePage = () => {
  const { id } = useParams();
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const getArtisan = async (params: string) => {
    try {
      const response = await usersAPI.getArtisan(params);
      setArtisan(response.data.artisan);
    } catch (error) {
      console.error("Error fetching artisan:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (artisanId: string) => {
    try {
      setLoadingReviews(true);
      const response = await reviewsAPI.getArtisanReviews(artisanId);
      setReviews(response.data.reviews);
      console.log("Fetched reviews:", response.data.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      getArtisan(id);
      fetchReviews(id);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading artisan profile...</p>
        </div>
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Artisan not found</h2>
          <p className="text-gray-600 mb-4">The artisan you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="text-blue-600 hover:underline">Return to home</Link>
        </div>
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
                    <span className="text-gray-600 text-sm">
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

              <TabsContent value="reviews">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl mb-4">Reviews ({reviews.length})</h3>
                    {loadingReviews ? (
                      <p>Loading reviews...</p>
                    ) : reviews.length === 0 ? (
                      <p className="text-gray-500">No reviews yet.</p>
                    ) : (
                      <div className="grid gap-6 md:grid-cols-2">
                        {reviews.map((review) => (
                          <div
                            key={review._id}
                            className="group relative bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                                  {review.client?.name?.charAt(0) || "U"}
                                </div>
                                <div>
                                  <h4 className="font-medium text-slate-900 leading-none">
                                    {review.client?.name}
                                  </h4>
                                  <p className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider font-medium">
                                    {new Date(
                                      review.createdAt,
                                    ).toLocaleDateString(undefined, {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </p>
                                </div>
                              </div>
                              <div className="flex bg-slate-50 px-2 py-1 rounded-lg">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3.5 h-3.5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                                  />
                                ))}
                              </div>
                            </div>

                            <p className="text-slate-600 text-sm leading-relaxed italic">
                              "{review.comment}"
                            </p>

                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-10 transition-opacity">
                              <Quote className="w-8 h-8 text-indigo-600" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
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