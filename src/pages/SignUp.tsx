
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuthLocal } from "@/hooks/useAuthLocal";
import { Label } from "@/components/ui/label";
import { useProfiles } from "@/hooks/useProfiles";

const SignUp = () => {
  const [profileName, setProfileName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuthLocal();
  const { profiles, createProfile, setActiveProfile } = useProfiles();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!profileName.trim() || !email.trim()) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    const res = signUp(email, profileName);
    
    if (!res.success) {
      setError(res.error!);
      setLoading(false);
    } else {
      // After sign up, create and activate business profile if it doesn't exist
      let profile = profiles.find((p) => p.name === profileName);
      if (!profile) {
        profile = createProfile({
          name: profileName,
          logo: "",
          email: email,
          address: "",
        });
      }
      if (profile) {
        setActiveProfile(profile.id);
      }
      // Navigate to dashboard
      navigate("/dashboard");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tl from-blue-200 via-white to-purple-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="profileName">Profile Name</Label>
              <Input 
                id="profileName" 
                type="text" 
                required 
                value={profileName} 
                onChange={e => setProfileName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
          <div className="text-xs mt-2">
            Already have an account? <Link className="underline" to="/signin">Sign In</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
