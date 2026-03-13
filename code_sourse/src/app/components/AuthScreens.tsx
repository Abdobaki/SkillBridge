import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { ArrowLeft } from 'lucide-react';

interface AuthScreensProps {
  onComplete: (userData: { name: string; email: string }) => void;
  onBack?: () => void;
}

export function LoginScreen({ onComplete, onBack }: AuthScreensProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({ name: 'Abdelbaki', email });
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      {onBack && (
        <div className="p-4">
          <button onClick={onBack} className="p-2">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
        </div>
      )}

      <div className="flex-1 px-8 pt-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2 text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground">
            Sign in to continue your journey
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email or Phone</Label>
            <Input
              id="email"
              type="text"
              placeholder="Enter your email or phone"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-input-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 bg-input-background"
            />
          </div>

          <button
            type="button"
            className="text-primary text-sm"
          >
            Forgot password?
          </button>

          <Button
            type="submit"
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 mt-6"
          >
            Login
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Continue with Apple
            </Button>
          </div>
        </form>
      </div>

      <div className="p-8 text-center">
        <p className="text-muted-foreground text-sm">
          Don't have an account?{' '}
          <button className="text-primary">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

export function SignUpScreen({ onComplete, onBack }: AuthScreensProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profession: '',
    country: '',
    agreedToTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({ name: formData.name, email: formData.email });
  };

  return (
    <div className="h-full flex flex-col bg-background overflow-y-auto">
      {/* Header */}
      {onBack && (
        <div className="p-4 sticky top-0 bg-background z-10">
          <button onClick={onBack} className="p-2">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
        </div>
      )}

      <div className="flex-1 px-8 pb-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2 text-foreground">Create Account</h1>
          <p className="text-muted-foreground">
            Join thousands of professionals
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="h-12 bg-input-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="h-12 bg-input-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <Input
              id="signup-password"
              type="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="h-12 bg-input-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profession">Profession</Label>
            <Input
              id="profession"
              type="text"
              placeholder="e.g., Data Scientist"
              value={formData.profession}
              onChange={(e) =>
                setFormData({ ...formData, profession: e.target.value })
              }
              className="h-12 bg-input-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              type="text"
              placeholder="Enter your country"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              className="h-12 bg-input-background"
            />
          </div>

          <div className="flex items-start space-x-3 pt-2">
            <Checkbox
              id="terms"
              checked={formData.agreedToTerms}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, agreedToTerms: checked as boolean })
              }
            />
            <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 mt-6"
          >
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm">
            Already have an account?{' '}
            <button className="text-primary">
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
