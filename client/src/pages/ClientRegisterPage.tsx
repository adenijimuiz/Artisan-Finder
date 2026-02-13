import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";
import { authAPI } from "../services/api";
import { toast } from "react-toastify";

export const ClientRegisterPage = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useApp();
  const [CurrentState, setCurrentState] = useState("Register"); // 'Register' or 'Login'

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let response;

      switch (CurrentState) {
        case "Register":
          response = await authAPI.register(formData);

          if (response.data.success) {
            setCurrentUser(response.data.user);
            toast.success("Registration successful! Welcome to ArtisanFinder.");
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            // Navigate based on role
            const rolePath =
              response.data.user.role === "client"
                ? "/dashboard/client"
                : "/dashboard/artisan";
            navigate(rolePath);
          } else {
            toast.error(response.data.message);
            console.error("Registration failed:", response.data.message);
          }
          break;

        case "Login":
          response = await authAPI.login(formData.email, formData.password);

          if (response.data.success) {
            setCurrentUser(response.data.user);
            toast.success("Login successful! Welcome back.");
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            // Navigate based on role
            const rolePath =
              response.data.user.role === "client"
                ? "/dashboard/client"
                : "/dashboard/artisan";
            navigate(rolePath);
          } else {
            toast.error(response.data.message || "Login failed. Please try again.");
            console.error("Login failed:", response.data.message);
          }
          break;

        default:
          toast.error("Invalid form state");
          console.error("Unknown CurrentState:", CurrentState);
          break;
      }
    } catch (error: any) {
      console.error("Error during authentication:", error);
      
      // Handle API validation errors (success: false responses)
      if (error.message) {
        toast.error(error.message);
      } 
      // Handle axios error responses
      else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
      // Generic fallback
      else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-md">
        <Card>
          {CurrentState === "Register" ? (
            <CardHeader>
              <CardTitle className="text-2xl">Create Your Account</CardTitle>
              <p className="text-gray-600">Join to find skilled artisans</p>
            </CardHeader>
          ) : (
            <CardHeader>
              <CardTitle className="text-2xl text-center">Log in</CardTitle>
              <p className="text-gray-600">
                Let find our right skilled artisans
              </p>
            </CardHeader>
          )}

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {CurrentState === "Register" && (
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
              )}

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

              {CurrentState === "Register" && (
                <>
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

                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      required
                      placeholder="e.g 123, Main St, ifako-ijaiye, Lagos"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                    />
                  </div>
                </>
              )}

              <Button type="submit" className="w-full">
                {CurrentState === "Register" ? "Register" : "Log In"}
              </Button>

              {CurrentState === "Register" ? (
                <div className="text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <span
                    onClick={() => setCurrentState("Login")}
                    className="text-blue-600 cursor-pointer"
                  >
                    Login
                  </span>
                </div>
              ) : (
                <div className="text-center text-sm text-gray-600">
                  Don't have an account?{" "}
                  <span
                    onClick={() => setCurrentState("Register")}
                    className="text-blue-600 cursor-pointer"
                  >
                    Register
                  </span>
                </div>
              )}
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
