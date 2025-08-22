import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Wallet, ArrowLeft, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import flashpayLogo from "@/assets/flashpay-logo.png";

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const connectYellowWallet = async () => {
    setIsLoading(true);
    try {
      // Yellow SDK Nitro wallet integration will be implemented once Supabase is connected
      console.log("Connecting to Yellow Nitro wallet...");
      // This would integrate with Yellow SDK for gasless wallet connection
      setTimeout(() => {
        setIsLoading(false);
        // Placeholder for successful connection
        alert("Yellow Nitro wallet connection will be available once backend is set up!");
      }, 2000);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <Link 
          to="/" 
          className="inline-flex items-center text-foreground/70 hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Logo */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          <img 
            src={flashpayLogo} 
            alt="FlashPay" 
            className="h-10 w-10 animate-pulse-glow"
          />
          <span className="text-2xl font-bold text-gradient">FlashPay</span>
        </div>

        <Card className="glass-card border-border/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your FlashPay account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="glass"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="glass pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/60"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button className="w-full" variant="hero" size="lg">
                  <Zap className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="glass"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-register">Email</Label>
                  <Input
                    id="email-register"
                    type="email"
                    placeholder="Enter your email"
                    className="glass"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-register">Password</Label>
                  <div className="relative">
                    <Input
                      id="password-register"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      className="glass pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/60"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button className="w-full" variant="hero" size="lg">
                  <Zap className="h-4 w-4 mr-2" />
                  Create Account
                </Button>
              </TabsContent>
            </Tabs>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-foreground/60">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Yellow Wallet Connect */}
            <Button
              onClick={connectYellowWallet}
              disabled={isLoading}
              variant="outline"
              className="w-full glass hover:border-primary/50"
              size="lg"
            >
              <Wallet className="h-4 w-4 mr-2" />
              {isLoading ? "Connecting..." : "Connect Yellow Nitro Wallet"}
            </Button>

            <p className="text-xs text-foreground/60 text-center mt-4">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;