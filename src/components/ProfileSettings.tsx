
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthLocal } from "@/hooks/useAuthLocal";
import { LogOut, User, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileSettings = () => {
  const { user, signIn, signUp, signOut } = useAuthLocal();
  const navigate = useNavigate();
  
  // Sign In state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInLoading, setSignInLoading] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  
  // Sign Up state
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpProfileName, setSignUpProfileName] = useState("");
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signUpError, setSignUpError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);
    setSignInLoading(true);

    if (!signInEmail.trim()) {
      setSignInError("Email is required");
      setSignInLoading(false);
      return;
    }

    const res = signIn(signInEmail);
    
    if (!res.success) {
      setSignInError(res.error!);
    } else {
      setSignInEmail("");
      // Don't navigate, just refresh the component
    }
    setSignInLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError(null);
    setSignUpLoading(true);

    if (!signUpProfileName.trim() || !signUpEmail.trim()) {
      setSignUpError("All fields are required");
      setSignUpLoading(false);
      return;
    }

    const res = signUp(signUpEmail, signUpProfileName);
    
    if (!res.success) {
      setSignUpError(res.error!);
    } else {
      setSignUpEmail("");
      setSignUpProfileName("");
      // Don't navigate, just refresh the component
    }
    setSignUpLoading(false);
  };

  const handleSignOut = () => {
    signOut();
  };

  // If user is logged in, show profile info and logout
  if (user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">✅ Signed in successfully</p>
            <p className="text-green-700 text-sm mt-1">
              Welcome to Comprehensive Invoice Procedure!
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">{user.profileName}</p>
                <p className="text-sm text-gray-600">Profile Name</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">{user.email}</p>
                <p className="text-sm text-gray-600">Email Address</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSignOut}
            variant="outline"
            className="w-full flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    );
  }

  // If user is not logged in, show login/signup tabs
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Access</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signin" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  required
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  disabled={signInLoading}
                  placeholder="Enter your email"
                />
              </div>
              {signInError && (
                <div className="text-red-600 text-sm">{signInError}</div>
              )}
              <Button type="submit" className="w-full" disabled={signInLoading}>
                {signInLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <Label htmlFor="signup-profile">Profile Name</Label>
                <Input
                  id="signup-profile"
                  type="text"
                  required
                  value={signUpProfileName}
                  onChange={(e) => setSignUpProfileName(e.target.value)}
                  disabled={signUpLoading}
                  placeholder="Enter your profile name"
                />
              </div>
              <div>
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  required
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  disabled={signUpLoading}
                  placeholder="Enter your email"
                />
              </div>
              {signUpError && (
                <div className="text-red-600 text-sm">{signUpError}</div>
              )}
              <Button type="submit" className="w-full" disabled={signUpLoading}>
                {signUpLoading ? "Creating Account..." : "Sign Up"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            <strong>Welcome to Comprehensive Invoice Procedure!</strong> Sign in to access your invoices, 
            or create a new account to get started with professional invoice management.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
