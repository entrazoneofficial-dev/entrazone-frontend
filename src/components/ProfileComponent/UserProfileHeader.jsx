import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Camera,
  Edit,
  Save,
  UserRound,
  X,
  MapPin,
  Phone,
  Home,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { ProfileApi } from "../../lib/api/profile";
import { updateProfile } from "../../Redux/slices/authSlice";
import { backendUrl } from "../../constant/BaseUrl";

export default function UserProfileHeader() {
  const { user } = useSelector((state) => state.auth);
  
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    address: "",
    state: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

useEffect(() => {
  if (user) {
    setFormData({
      email: user.email || "",
      name: user.name || "",
      address: user.address || "",
      state: user.state || "",
    });

    if (user.image) {
      if (user.image.startsWith('http')) {
        setPreviewImage(user.image);
      } else {
        setPreviewImage(`${backendUrl}/${user.image}`);
      }
    }
  }
}, [user]);

  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const joinDate = user?.created
    ? new Date(user.created).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("state", formData.state);

      if (selectedImage) {
        formDataToSend.append("image", selectedImage);
        console.log(
          "Selected image:",
          selectedImage.name,
          `(${(selectedImage.size / 1024 / 1024).toFixed(2)} MB)`
        );
      }

      console.log({
        name: formData.name,
        email: formData.email,
        address: formData.address,
        state: formData.state,
        image: selectedImage ? selectedImage.name : "No image selected",
      });

      const response = await ProfileApi.profileEdit(formDataToSend);

      if (response.status === "success") {
        dispatch(updateProfile(response.user));
        setSelectedImage(null);
      }

      setSuccess("Profile updated successfully");

      setIsModalOpen(false);
      setSelectedImage(null);

    } catch (error) {
      setError(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full">
          <Link
            to="/"
            className="p-2 bg-white rounded-full transition-colors shrink-0 hover:bg-gray-100 self-start sm:self-center"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="sr-only">Go back</span>
          </Link>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full">
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-[#9333EA] to-[#DB2777] text-white text-2xl sm:text-3xl md:text-4xl font-bold flex items-center justify-center overflow-hidden">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{getInitials(user.name || user.email)}</span>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-0 cursor-pointer right-0 bg-gradient-to-r from-[#9333EA] to-[#DB2777] rounded-full shadow-md p-1 sm:p-2 hover:opacity-90"
                aria-label="Edit profile picture"
                onClick={() => setIsModalOpen(true)}
              >
                <Edit className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </Button>
            </div>

            <div className="text-center sm:text-left space-y-1 sm:space-y-1.5 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 break-words">
                {user.name || user.email.split("@")[0]}
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 break-all">
                {user.email}
              </p>

              <div className="flex flex-col gap-1 pt-2">
                {user.phone && (
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-600">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.address && (
                  <div className="flex items-start justify-center sm:justify-start gap-2 text-sm text-gray-600">
                    <Home className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5" />
                    <span className="text-left">{user.address}</span>
                  </div>
                )}
                {user.state && (
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-600">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{user.state}</span>
                  </div>
                )}
              </div>
              {joinDate && (
                <p className="text-xs text-green-500 font-light">Member since {joinDate}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[95vw] max-w-md sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              Edit Profile
            </DialogTitle>
            <button
              onClick={() => {
                setIsModalOpen(false);
                setSelectedImage(null);
                if (user.image) {
                  setPreviewImage(user.image);
                } else {
                  setPreviewImage(null);
                }
              }}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-[#9333EA] to-[#DB2777] text-white flex items-center justify-center overflow-hidden p-0"
                  onClick={triggerFileInput}
                >
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-8 h-8 sm:w-10 sm:h-10" />
                  )}
                </Button>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 text-center">
                {previewImage
                  ? "Click to change image"
                  : "Click the camera icon to change your profile picture"}
              </p>
            </div>

            <hr />

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-base sm:text-lg font-semibold text-gray-900">
                <UserRound className="w-4 h-4 sm:w-5 sm:h-5 text-[#9333EA]" />
                Basic Information
              </div>
              <div className="grid gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    disabled
                    className="w-full px-4 py-2.5 border bg-gray-100 rounded-lg outline-none text-sm sm:text-base"
                  />
                </div>
                {user.phone && (
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <input
                      id="phone"
                      value={user.phone}
                      disabled
                      className="w-full px-4 py-2.5 border bg-gray-100 rounded-lg outline-none text-sm sm:text-base"
                    />
                  </div>
                )}
              </div>
            </div>

            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            {success && (
              <div className="text-green-500 text-sm mt-2">{success}</div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="border-gray-300 cursor-pointer hover:bg-gray-50 flex-1 sm:flex-none"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedImage(null);
                if (user.image) {
                  setPreviewImage(user.image);
                } else {
                  setPreviewImage(null);
                }
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r cursor-pointer from-[#9333EA] to-[#DB2777] hover:opacity-90 flex-1 sm:flex-none"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                "Saving..."
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
