import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  Shield,
  User,
  Edit3,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Bell,
  Moon,
  LogOut,
  Key,
  Briefcase,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    darkMode: false,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Profile updated successfully!");
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <p className="text-lg font-medium">User not found</p>
          <Button onClick={() => navigate("/login")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Profile</h1>
                <p className="text-sm text-muted-foreground">Manage your account settings</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {/* Profile Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="h-24 w-24 ring-4 ring-primary/10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-purple-600 text-white">
                    {getInitials(user.name || "User")}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 h-7 w-7 bg-green-500 rounded-full flex items-center justify-center ring-4 ring-background">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left space-y-3">
                <div>
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <Shield className="h-3 w-3" />
                    {user.role || "AGENT"}
                  </Badge>
                  {user.isVerified && (
                    <Badge className="bg-green-100 text-green-700 gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                  {user.organization && (
                    <Badge variant="outline" className="gap-1">
                      <Building2 className="h-3 w-3" />
                      {user.organization.name}
                    </Badge>
                  )}
                </div>
                {user.createdAt && (
                  <p className="text-xs text-muted-foreground flex items-center justify-center md:justify-start gap-1">
                    <Calendar className="h-3 w-3" />
                    Member since {formatDate(user.createdAt)}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </CardTitle>
            <CardDescription>Your personal details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs text-muted-foreground uppercase tracking-wider">
                  Full Name
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{user.name || "Not provided"}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs text-muted-foreground uppercase tracking-wider">
                  Email Address
                </Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{user.email || "Not provided"}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs text-muted-foreground uppercase tracking-wider">
                  Phone Number
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{user.phoneNumber || "Not provided"}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Location
                </Label>
                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {user.location?.coordinates
                      ? `${user.location.coordinates[1].toFixed(4)}, ${user.location.coordinates[0].toFixed(4)}`
                      : "Not provided"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Organization Info */}
        {user.organization && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5 text-primary" />
                Organization
              </CardTitle>
              <CardDescription>Your organization details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    Organization Name
                  </Label>
                  <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{user.organization.name}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    Service Provider
                  </Label>
                  <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{user.serviceProvider?.name || "N/A"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="h-5 w-5 text-primary" />
              Preferences
            </CardTitle>
            <CardDescription>Customize your notification and display settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive booking updates via email</p>
                </div>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, emailNotifications: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Get instant alerts for new bookings</p>
                </div>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, pushNotifications: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Moon className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Use dark theme for the app</p>
                </div>
              </div>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={(checked) => setSettings({ ...settings, darkMode: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-primary" />
              Security
            </CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4">
              <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Key className="h-5 w-5 text-orange-600" />
              </div>
              <div className="text-left">
                <p className="font-medium">Change Password</p>
                <p className="text-sm text-muted-foreground">Update your account password</p>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <Button
              variant="destructive"
              className="w-full gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-3">
              You will be redirected to the login page
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
