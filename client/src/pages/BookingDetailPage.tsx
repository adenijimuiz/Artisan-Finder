import { useParams, useNavigate } from "react-router-dom";
import { useApp, type Booking } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Star,
  MessageCircle,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { bookingsAPI } from "@/services/api";
import { useEffect, useState } from "react";

const BookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useApp(); // Removed unused users and updateBooking
  const [booking, setBooking] = useState<Booking | null>(null);

  const fetchBooking = async (bookingId: string) => {
    try {
      const response = await bookingsAPI.getBooking(bookingId);
      if (response.data.success) {
        setBooking(response.data.booking);
        console.log(response.data.booking)
      } else {
        console.error(
          "Failed to fetch booking details:",
          response.data.message,
        );
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBooking(id);
    }
  }, [id]);

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">Booking not found</p>
            <Button onClick={() => navigate(-1)} className="mt-4">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isArtisan = currentUser?._id === booking.artisan._id;
  const isClient = currentUser?._id === booking.client._id;

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

  // const getActivityColor = (status: string) => {
  //   switch (status) {
  //     case "pending":
  //       return "bg-yellow-100";
  //     case "accepted":
  //       return "bg-green-200";
  //     case "completed":
  //       return "bg-emerald-950";
  //     case "cancelled":
  //       return "bg-red-500";
  //     case "rejected":
  //       return "bg-red-500";
  //     case "in-progress":
  //       return "bg-purple-100";
  //     default:
  //       return "bg-gray-100 text-gray-800";
  //   }
  // };

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

  // API action handlers
  const acceptBooking = async () => {
    try {
      const response = await bookingsAPI.acceptBooking(booking._id);
      if (response.data.success) {
        setBooking(response.data.booking);
      } else {
        console.error("Failed to accept booking:", response.data.message);
      }
    } catch (error) {
      console.error("Error accepting booking:", error);
    }
  };

  const rejectBooking = async () => {
    try {
      const response = await bookingsAPI.rejectBooking(booking._id);
      if (response.data.success) {
        setBooking(response.data.booking);
      } else {
        console.error("Failed to reject booking:", response.data.message);
      }
    } catch (error) {
      console.error("Error rejecting booking:", error);
    }
  };

  const cancelBooking = async () => {
    try {
      const response = await bookingsAPI.cancelBooking(booking._id);
      if (response.data.success) {
        setBooking(response.data.booking);
      } else {
        console.error("Failed to cancel booking:", response.data.message);
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  const startBooking = async () => {
    try {
      const response = await bookingsAPI.inProgressBooking(booking._id); // Assumes this endpoint exists
      if (response.data.success) {
        setBooking(response.data.booking);
      } else {
        console.error("Failed to start booking:", response.data.message);
      }
    } catch (error) {
      console.error("Error starting booking:", error);
    }
  };

  const completeBooking = async () => {
    try {
      const response = await bookingsAPI.completeBooking(booking._id);
      if (response.data.success) {
        setBooking(response.data.booking);
      } else {
        console.error("Failed to complete booking:", response.data.message);
      }
    } catch (error) {
      console.error("Error completing booking:", error);
    }
  };

  // Helper to get initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold mb-2">Booking Details</h1>
            <p className="text-gray-600">Booking ID: {booking._id}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Status</CardTitle>
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg  ${getStatusColor(booking.status)}`}
                  >
                    {getStatusIcon(booking.status)}
                    <span className="capitalize font-semibold">
                      {booking.status}
                    </span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Service Details */}
            <Card>
              <CardHeader>
                <CardTitle>Service Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-600 block mb-2">
                    Service Type
                  </label>
                  <p className="text-lg text-gray-900">{booking.serviceType}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 block mb-2">
                    Description
                  </label>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {booking.description}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <Calendar className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                    <div>
                      <label className="text-sm font-semibold text-gray-600">
                        Date
                      </label>
                      <p className="text-gray-900">{booking.date}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Clock className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                    <div>
                      <label className="text-sm font-semibold text-gray-600">
                        Time
                      </label>
                      <p className="text-gray-900">
                        {booking.time || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                    <div>
                      <label className="text-sm font-semibold text-gray-600">
                        Location
                      </label>
                      <p className="text-gray-900">{booking.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <DollarSign className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                    <div>
                      <label className="text-sm font-semibold text-gray-600">
                        Budget
                      </label>
                      <p className="text-gray-900">
                        ${booking.budget || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>

                {booking.specialInstructions && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <label className="text-sm font-semibold text-gray-600 block mb-2">
                      Special Instructions
                    </label>
                    <p className="text-gray-700">
                      {booking.specialInstructions}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Images Gallery */}
            {booking.images && booking.images.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Service Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {booking.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative rounded-lg overflow-hidden bg-gray-100 aspect-square hover:shadow-lg transition-shadow"
                      >
                        <img
                          src={image.url}
                          alt={`Booking image ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            {isArtisan && booking.status === "pending" && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6 space-y-4">
                  <p className="text-sm text-gray-600">
                    You can accept or decline this booking request
                  </p>
                  <div className="flex gap-4">
                    <Button
                      onClick={acceptBooking}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Accept Booking
                    </Button>
                    <Button
                      onClick={rejectBooking}
                      variant="outline"
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Decline
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {isClient &&
              booking.status !== "completed" &&
              booking.status !== "accepted" &&
              booking.status !== "cancelled" &&
              booking.status !== "in-progress" &&
              booking.status !== "rejected" && (
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="pt-6">
                    <Button
                      onClick={cancelBooking}
                      variant="outline"
                      className="w-full text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel Booking
                    </Button>
                  </CardContent>
                </Card>
              )}

            {booking.status === "accepted" && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <Button
                    onClick={startBooking}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Start Work (In Progress)
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Artisan can also complete a booking (if in-progress or accepted) */}
            {isArtisan && booking.status === "in-progress" && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <Button
                    onClick={completeBooking}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Completed
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Artisan Info */}
            <Card>
              <CardHeader>
                <CardTitle>Artisan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">

                  {
                    booking.artisan.avatar ? 
                      <div className="w-16 h-16 rounded-full overflow-hidden">
                        <img src={booking.artisan.avatar} alt={`${booking.artisan.name}'s avatar`} className="w-full h-full object-cover" /> </div>: <div className="w-16 h-16 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {getInitials(booking.artisan.name)}
                  </div>
                  }
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">
                      {booking.artisan.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {booking.artisan.email}
                    </p>
                    {booking.artisan.verified && (
                      <Badge className="mt-2 bg-blue-100 text-blue-800">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4 space-y-3">
                  {booking.artisan.rating && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">
                          {booking.artisan.rating}
                        </span>
                        <span className="text-sm text-gray-600">
                          ({booking.artisan.reviewCount || 0})
                        </span>
                      </div>
                    </div>
                  )}
                  {booking.artisan.phone && (
                    <div>
                      <span className="text-sm text-gray-600">Phone</span>
                      <p className="font-medium">{booking.artisan.phone}</p>
                    </div>
                  )}
                  {booking.artisan.location && (
                    <div>
                      <span className="text-sm text-gray-600">Location</span>
                      <p className="font-medium">{booking.artisan.location}</p>
                    </div>
                  )}
                  {booking.artisan.experience && (
                    <div>
                      <span className="text-sm text-gray-600">Experience</span>
                      <p className="font-medium">
                        {booking.artisan.experience}
                      </p>
                    </div>
                  )}
                </div>

                <Button className="w-full" variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
              </CardContent>
            </Card>

            {/* Client Info */}
            <Card>
              <CardHeader>
                <CardTitle>Client</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-linear-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {getInitials(booking.client.name)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">
                      {booking.client.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {booking.client.email}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-3">
                  {booking.client.phone && (
                    <div>
                      <span className="text-sm text-gray-600">Phone</span>
                      <p className="font-medium">{booking.client.phone}</p>
                    </div>
                  )}
                  {booking.client.location && (
                    <div>
                      <span className="text-sm text-gray-600">Location</span>
                      <p className="font-medium">{booking.client.location}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Timeline / Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      <div className="w-0.5 h-12 bg-gray-200"></div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Booking Created</p>
                      <p className="text-xs text-gray-600">
                        {new Date(booking.createdAt).toLocaleDateString() ||
                          "Today"}
                      </p>
                    </div>
                  </div>
                  {booking.statusHistory && booking.statusHistory.length > 0 ? (
                    // Sort history by timestamp (oldest first)
                    [...booking.statusHistory]
                      .sort(
                        (a, b) =>
                          new Date(a.changedAt).getTime() -
                          new Date(b.changedAt).getTime(),
                      )
                      .map((entry, index) => {
                        return (
                          <div key={index} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="flex flex-col items-center">
                                <div
                                  className={`w-3 h-3 ${getStatusColor(entry.status)} rounded-full`}
                                ></div>
                                <div className="w-0.5 h-12 bg-gray-200"></div>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-semibold capitalize">
                                {entry.status}
                              </p>
                              <p className="text-xs text-gray-600">
                                {new Date(entry.changedAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    // Fallback to simple timeline if no history
                    <>
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                          <div className="w-0.5 h-12 bg-gray-200"></div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">
                            Booking Created
                          </p>
                          <p className="text-xs text-gray-600">
                            {new Date(booking.createdAt).toLocaleDateString() ||
                              "Today"}
                          </p>
                        </div>
                      </div>

                      {booking.status !== "pending" && (
                        <div className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-3 h-3 rounded-full ${getStatusColor(booking.status).split(" ")[0]}`}
                            />
                            {booking.status !== "completed" && (
                              <div className="w-0.5 h-12 bg-gray-200"></div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold capitalize">
                              {booking.status === "accepted"
                                ? "Accepted"
                                : booking.status === "in-progress"
                                  ? "In Progress"
                                  : booking.status === "completed"
                                    ? "Completed"
                                    : "Updated"}
                            </p>
                            <p className="text-xs text-gray-600">
                              {booking.updatedAt
                                ? new Date(
                                    booking.updatedAt,
                                  ).toLocaleDateString()
                                : "Recently"}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;
