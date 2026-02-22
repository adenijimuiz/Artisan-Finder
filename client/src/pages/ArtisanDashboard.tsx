import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
import {
  // DollarSign,
  Star,
  Calendar,
  MessageSquare,
  User,
  // Image,
  Loader2,
  Plus,
  Verified,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Quote,
} from "lucide-react";
import { authAPI, bookingsAPI, reviewsAPI, usersAPI } from "@/services/api";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const ArtisanDashboard = () => {
  const { setCurrentUser, currentUser, bookings, setBookings, navigate } =
    useApp();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);

  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    bio: "",
    skills: "",
    experience: "",
    priceRange: "",
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const getBooking = async () => {
    try {
      const response = await bookingsAPI.getBookings();
      if (response.data.success) {
        setBookings(response.data.bookings);
      } else {
        toast.error(response.data.message || "Failed to fetch bookings");
      }
      console.log("Bookings response", response);
      console.log("Bookings response", response.data);
    } catch (error) {
      toast.error("Error fetching bookings");
      console.log("Error fetching bookings", error);
    }
  };

  const getReviews = async (artisanId: string) => {
    try {
      const response = await reviewsAPI.getArtisanReviews(artisanId);
      console.log("Reviews response", response);
      if (response.data.success) {
        setReviews(response.data.reviews);
      } else {
        toast.error(response.data.message || "Failed to fetch reviews");
      }
    } catch (error) {
      toast.error("Error fetching reviews");
      console.log("Error fetching reviews", error);
    }
  };

  useEffect(() => {
    getBooking();
    if (currentUser?._id) {
      getReviews(currentUser._id);
    }
    // fetchUpdatedUser()
  }, []);

  const fetchUpdatedUser = async () => {
    try {
      const response = await authAPI.getMe();
      if (response.data.success) {
        console.log("Updated user data", response.data.user);
        setCurrentUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
    } catch (error) {
      console.error("Failed to fetch updated user", error);
    }
  };

  const startEditingProfile = () => {
    if (currentUser) {
      setProfileForm({
        bio: currentUser.bio || "",
        skills: currentUser.skills?.join(", ") || "",
        experience: currentUser.experience || "",
        priceRange: currentUser.priceRange || "",
      });
    }
    setIsEditingProfile(true);
  };

  const cancelEditingProfile = () => {
    setIsEditingProfile(false);
  };

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert skills string to array (split by commas, trim, remove empty)
    const skillsArray = profileForm.skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");

    const updates = {
      bio: profileForm.bio,
      skills: skillsArray,
      experience: profileForm.experience,
      priceRange: profileForm.priceRange,
    };

    setUpdatingProfile(true);
    try {
      const response = await usersAPI.updateProfile(updates);
      if (response.data.success) {
        toast.success("Profile updated successfully");
        await fetchUpdatedUser();
        setCurrentUser(response.data.user);
        setIsEditingProfile(false);
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Error updating profile");
      console.error(error);
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Avatar upload handler
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional: validate file type/size
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploadingAvatar(true);
    try {
      const response = await usersAPI.uploadAvatar(file);
      if (response.data.success) {
        toast.success("Avatar uploaded successfully");
        await fetchUpdatedUser();
        if (response.data.avatarUrl) {
          setCurrentUser({ ...currentUser!, avatar: response.data.avatarUrl });
        }
      } else {
        toast.error(response.data.message || "Failed to upload avatar");
      }
    } catch (error) {
      toast.error("Error uploading avatar");
      console.error(error);
    } finally {
      setUploadingAvatar(false);
      // Reset input so same file can be selected again
      e.target.value = "";
    }
  };

  // Portfolio upload handler (multiple files)
  const handlePortfolioUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validate each file
    const fileArray = Array.from(files);
    for (const file of fileArray) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB`);
        return;
      }
    }

    setUploadingPortfolio(true);
    try {
      const response = await usersAPI.uploadPortfolio(fileArray);
      if (response.data.success) {
        toast.success("Portfolio images uploaded successfully");
        await fetchUpdatedUser();
        // Update current user with new portfolio list
        // Assuming response.data.portfolioUrls contains array of new URLs
        if (response.data.portfolioUrls) {
          setCurrentUser({
            ...currentUser!,
            portfolio: [
              ...(currentUser?.portfolio || []),
              ...response.data.portfolioUrls,
            ],
          });
        }
      } else {
        toast.error(response.data.message || "Failed to upload portfolio");
      }
    } catch (error) {
      toast.error("Error uploading portfolio");
      console.error(error);
    } finally {
      setUploadingPortfolio(false);
      e.target.value = "";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-200 text-emerald-900";
      case "completed":
        return "bg-green-400 text-green-900";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "rejected":
        return "bg-red-500";
      case "in-progress":
        return "bg-purple-400 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      case "accepted":
        return <CheckCircle className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "in-progress":
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">
            Welcome back, {currentUser?.name}!{" "}
            {currentUser?.verified && <Verified className="inline" />}
          </h1>
          <p className="text-gray-600">Manage your artisan business</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-gray-600">Pending Requests</p>
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl">
                {bookings.filter((b) => b.status === "pending").length}
              </p>
            </CardContent>
          </Card>

          {/* <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-gray-600">Total Earnings</p>
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl">$4,580</p>
            </CardContent>
          </Card> */}

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-gray-600">Average Rating</p>
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <p className="text-3xl">{currentUser?.rating}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-gray-600">Total Reviews</p>
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-3xl">{currentUser?.reviewCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="requests" className="space-y-4">
          <TabsList>
            <TabsTrigger value="requests">Job Requests</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            {/* <TabsTrigger value="earnings">Earnings</TabsTrigger> */}
          </TabsList>

          <TabsContent value="requests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Job Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No job requests yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">
                              {booking.serviceType}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {booking.description}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg  ${getStatusColor(booking.status)}`}
                            >
                              {getStatusIcon(booking.status)}
                              <span className="capitalize font-semibold">
                                {booking.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            📅 {booking.date.slice(0, 10)} at {booking.time}
                          </p>
                          <p>📍 {booking.location}</p>
                          <p>💰 Budget: {booking.budget}</p>
                        </div>
                        <div className="mt-4">
                          <Button
                            size="lg"
                            variant="outline"
                            onClick={() =>
                              navigate(`/booking-detail/${booking._id}`)
                            }
                          >
                            View Details
                          </Button>

                          {/* <div className="flex gap-2 mt-4">
                              <Button size="sm">Accept</Button>
                              <Button size="sm" variant="outline">Decline</Button>
                            </div> */}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center">
                    {currentUser?.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt=""
                        className="rounded-full h-24 w-24"
                      />
                    ) : (
                      <User className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      id="avatar_img"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                      disabled={uploadingAvatar}
                    />
                    <label htmlFor="avatar_img">
                      <Button
                        variant="outline"
                        asChild
                        disabled={uploadingAvatar}
                        className="cursor-pointer"
                      >
                        <span>
                          {uploadingAvatar ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            "Change Photo"
                          )}
                        </span>
                      </Button>
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      Max size: 5MB. Formats: JPG, PNG, GIF
                    </p>
                  </div>
                </div>

                {isEditingProfile ? (
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Bio
                      </label>
                      <Textarea
                        name="bio"
                        value={profileForm.bio}
                        onChange={handleProfileChange}
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Skills (comma separated)
                      </label>
                      <Input
                        name="skills"
                        value={profileForm.skills}
                        onChange={handleProfileChange}
                        placeholder="e.g. Plumbing, Carpentry, Electrical"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Experience
                      </label>
                      <Input
                        name="experience"
                        value={profileForm.experience}
                        onChange={handleProfileChange}
                        placeholder="e.g. 5 years"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Price Range
                      </label>
                      <Input
                        name="priceRange"
                        value={profileForm.priceRange}
                        onChange={handleProfileChange}
                        placeholder="e.g. $50-100/hr"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={updatingProfile}>
                        {updatingProfile ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={cancelEditingProfile}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div>
                      <p className="text-sm mb-1">
                        <span className="font-medium">Bio:</span>{" "}
                        {currentUser?.bio || "Not provided"}
                      </p>
                      <p className="text-sm mb-1">
                        <span className="font-medium">Skills:</span>{" "}
                        {currentUser?.skills?.join(", ") || "None"}
                      </p>
                      <p className="text-sm mb-1">
                        <span className="font-medium">Experience:</span>{" "}
                        {currentUser?.experience || "Not provided"}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Price Range:</span>{" "}
                        {currentUser?.priceRange || "Not set"}
                      </p>
                    </div>
                    <Button onClick={startEditingProfile}>Edit Profile</Button>
                  </>
                )}

                {/* <div>
                  <p className="text-sm mb-1">Bio: {currentUser?.bio}</p>
                  <p className="text-sm mb-1">
                    Skills: {currentUser?.skills?.join(", ")}
                  </p>
                  <p className="text-sm mb-1">
                    Experience: {currentUser?.experience}
                  </p>
                  <p className="text-sm">
                    Price Range: {currentUser?.priceRange}
                  </p>
                </div>
                <Button>Edit Profile</Button> */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {currentUser?.portfolio?.map((img, idx) => (
                    <div
                      key={idx}
                      className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
                    >
                      <img
                        src={img}
                        alt={`Portfolio ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}

                  {/* Upload placeholder */}
                  <div className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 relative">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handlePortfolioUpload}
                      disabled={uploadingPortfolio}
                    />
                    <div className="text-center pointer-events-none">
                      {uploadingPortfolio ? (
                        <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-gray-400" />
                      ) : (
                        <Plus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      )}
                      <p className="text-sm text-gray-600">
                        {uploadingPortfolio ? "Uploading..." : "Add Images"}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Max 5MB per image. You can select multiple images at once.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Reviews & Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                {/* <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="border-b pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <p>{review.client?.name}</p>
                        <div className="flex">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{review.comment}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div> */}
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
                              {new Date(review.createdAt).toLocaleDateString(
                                undefined,
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* <TabsContent value="earnings">
            <Card>
              <CardHeader>
                <CardTitle>Earnings & Payouts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">This Month</p>
                      <p className="text-2xl">$1,240</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Last Month</p>
                      <p className="text-2xl">$1,890</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Earnings</p>
                      <p className="text-2xl">$4,580</p>
                    </div>
                  </div>
                  <Button>Request Payout</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
};
