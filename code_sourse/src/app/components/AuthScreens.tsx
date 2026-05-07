import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { ArrowLeft, User, GraduationCap, Shield, AlertCircle, Loader2 } from 'lucide-react';
import { UserRole } from '../types';
import { signInUser, signUpUser, signInWithGoogle, resetPassword } from '../../lib/api';

interface LoginScreenProps {
  onComplete: (userData: { name: string; email: string }) => void;
  onBack?: () => void;
  onSignUp?: () => void;
}

export function LoginScreen({ onComplete, onBack, onSignUp }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    setIsLoading(true);
    try {
      await signInUser(email, password);
      // Wait for App.tsx's onAuthStateChange to handle true navigation
      onComplete({ name: email.split('@')[0] || 'User', email });
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-background">
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

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="text"
              placeholder="Enter your email"
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
            onClick={async () => {
              if (!email.trim()) {
                setError('Please enter your email to reset your password.');
                return;
              }
              try {
                setIsLoading(true);
                await resetPassword(email);
                setError('');
                alert('Password reset email sent! Check your inbox.');
              } catch (err: any) {
                setError(err.message || 'Failed to send reset email');
              } finally {
                setIsLoading(false);
              }
            }}
          >
            Forgot password?
          </button>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 mt-6"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Login
          </Button>

          <>
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
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      await signInWithGoogle();
                    } catch (err: any) {
                      setError(err.message || 'Failed to initialize Google Login');
                    } finally {
                      setIsLoading(false);
                    }
                  }}
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
              </div>
            </>
        </form>
      </div>

      <div className="p-8 text-center">
        <p className="text-muted-foreground text-sm">
          Don't have an account?{' '}
          <button onClick={onSignUp} className="text-primary">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

interface SignUpScreenProps {
  onComplete: (userData: { name: string; email: string }) => void;
  onBack?: () => void;
  selectedRole: UserRole;
  onLogin?: () => void;
}

export function SignUpScreen({ onComplete, onBack, selectedRole, onLogin }: SignUpScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profession: '',
    country: '',
    agreedToTerms: false,
    role: selectedRole,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.agreedToTerms) {
      setError('You must agree to the Terms of Service.');
      return;
    }
    if (!formData.email || !formData.password || !formData.name) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    try {
      await signUpUser(formData.email, formData.password, formData.name, formData.role, formData.profession, formData.country);
      onComplete({ name: formData.name, email: formData.email });
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
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
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
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
            disabled={isLoading}
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 mt-6"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm">
            Already have an account?{' '}
            <button onClick={onLogin} className="text-primary">
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
