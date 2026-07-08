import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { Brain, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { api } from '@/utils/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.auth.login({ email, password });

      // The server returns success: true, user: { ... }, auth: { access_token: ... }
      if (response && response.success && response.auth?.access_token && response.user) {
        await login(response.auth.access_token);
        navigate('/');
      } else if (response && response.error) {
        setError(response.error);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-white dark:bg-zinc-950 transition-colors duration-300">

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-orange-500/10 dark:bg-orange-500/5 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-orange-600/10 dark:bg-orange-600/5 blur-[120px]" />
      </div>

      {/* Header with Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-4 z-10 w-full max-w-6xl mx-auto">

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center w-full">

          {/* Left Side - Brand/Hero area */}
          <div className="hidden lg:flex flex-col space-y-8 max-w-lg">
            <Link to="/" className="flex items-center gap-3 w-fit group">
              <div className="bg-orange-500 p-2.5 rounded-xl shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-all duration-300">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400">
                QuizMaster AI
              </span>
            </Link>

            <div className="space-y-4 pt-4 text-zinc-600 dark:text-zinc-400">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-zinc-900 dark:text-white">
                Learn smarter,<br />not harder.
              </h1>
              <p className="text-lg pb-4">
                Adaptive AI-generated quizzes tailored to your skill level. Track your progress, earn achievements, and master new subjects faster than ever.
              </p>

              <div className="flex items-center space-x-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-950 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                    </div>
                  ))}
                </div>
                <div className="text-sm font-medium">
                  Join <span className="text-orange-500 font-bold">10,000+</span> learners
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex justify-center w-full">
            <Card className="w-full max-w-md border-0 shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl ring-1 ring-zinc-200 dark:ring-zinc-800">
              <CardHeader className="space-y-3 pb-6 text-center">
                <div className="lg:hidden flex items-center justify-center gap-2 mb-2">
                  <div className="bg-orange-500 p-2 rounded-lg">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-zinc-900 dark:text-white">
                    QuizMaster AI
                  </span>
                </div>
                <CardTitle className="text-2xl lg:text-3xl font-bold">Welcome back</CardTitle>
                <CardDescription className="text-base text-zinc-500 dark:text-zinc-400">
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-5">
                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <p>{error}</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-zinc-700 dark:text-zinc-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                      Email address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 bg-zinc-50 dark:bg-zinc-950/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium leading-none text-zinc-700 dark:text-zinc-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                        Password
                      </label>
                      <Link to="#" className="text-sm font-medium text-orange-500 hover:text-orange-600 hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 bg-zinc-50 dark:bg-zinc-950/50"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 pt-4">
                  <Button
                    type="submit"
                    className="w-full h-12 text-base bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-lg shadow-orange-500/25 group"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>


                  <div className="text-center text-sm text-zinc-500 dark:text-zinc-400 pt-2">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-semibold text-orange-500 hover:text-orange-600 hover:underline">
                      Sign up
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
