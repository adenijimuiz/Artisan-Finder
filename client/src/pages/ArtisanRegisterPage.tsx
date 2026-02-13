import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";
import { authAPI } from "@/services/api";
import { toast } from "react-toastify";
// import { Upload } from 'lucide-react';

export const ArtisanRegisterPage = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { setCurrentUser } = useApp();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    bio: "",
    skills: "",
    experience: "",
    location: "",
    priceRange: "",
    businessName: "",
    nin: "",
    nextOfKinName: "",
    nextOfKinAddress: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    try {
      const artisanData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        bio: formData.bio,
        skills: formData.skills.split(",").map((s) => s.trim()), // Convert string to array
        experience: formData.experience,
        priceRange: formData.priceRange,
        location: formData.location,
        businessName: formData.businessName,
        nin: formData.nin,
        nextOfKinName: formData.nextOfKinName,
        nextOfKinAddress: formData.nextOfKinAddress,
      };
      const response = await authAPI.registarArtisan(artisanData);
      console.log("Registration response", response.data);
      if (response.data.success) {
        setCurrentUser(response.data.user);
        navigate("/dashboard/artisan");
      } else {
        toast.error(
          response.data.message || "Registration failed. Please try again.",
        );
      }
    } catch (error :any) {
      console.log("Error during registration:", error);
      toast.error(
        error.message || "An error occurred during registration. Please try again later.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Register as an Artisan - Step {step} of 3
            </CardTitle>
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
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      placeholder="e.g., John's Carpentry Services"
                      required
                      value={formData.businessName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          businessName: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="skills">Skills (comma-separated) *</Label>
                    <Input
                      id="skills"
                      placeholder="e.g., Carpentry, Furniture Making, Cabinet Installation"
                      required
                      value={formData.skills}
                      onChange={(e) =>
                        setFormData({ ...formData, skills: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience">Years of Experience *</Label>
                    <Input
                      id="experience"
                      placeholder="e.g., 5 years"
                      required
                      value={formData.experience}
                      onChange={(e) =>
                        setFormData({ ...formData, experience: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Professional Bio *</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell clients about your expertise..."
                      required
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Service Location *</Label>
                    <Input
                      id="location"
                      placeholder="e.g 123, Main St, ifako-ijaiye, Lagos"
                      required
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="priceRange">Price Range *</Label>
                    <Input
                      id="priceRange"
                      placeholder="e.g ₦5,000-₦100,000"
                      required
                      value={formData.priceRange}
                      onChange={(e) =>
                        setFormData({ ...formData, priceRange: e.target.value })
                      }
                    />
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div>
                    <Label htmlFor="Nin">Nin *</Label>
                    <Input
                      id="Nin"
                      placeholder="e.g., 12345678901"
                      required
                      value={formData.nin}
                      onChange={(e) =>
                        setFormData({ ...formData, nin: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="nextOfKin">Next Of Kin *</Label>
                    <Input
                      id="nextOfKin"
                      placeholder="e.g., John Doe, 08012345678"
                      required
                      value={formData.nextOfKinName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nextOfKinName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="nextOfKinAddress">
                      Next Of Kin Address *
                    </Label>
                    <Input
                      id="nextOfKinAddress"
                      placeholder="e.g., 123, Main St, ifako-ijaiye, Lagos"
                      required
                      value={formData.nextOfKinAddress}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nextOfKinAddress: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              )}

              {/* {step === 3 && (
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
              )} */}

              <div className="flex justify-between pt-4">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                  >
                    Previous
                  </Button>
                )}
                <Button type="submit" className="ml-auto">
                  {step === 3 ? "Complete Registration" : "Next"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
