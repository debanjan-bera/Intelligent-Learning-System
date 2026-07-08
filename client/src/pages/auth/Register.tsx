import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { Brain, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { api } from '@/utils/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await api.auth.register({ name, email, password });
      
      if (response && response.success && response.auth?.access_token) {
        // Successful registration, log in the user and redirect to dashboard
        await login(response.auth.access_token);
        navigate('/');
      } else if (response && response.error) {
        setError(response.error);
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-white dark:bg-zinc-950 transition-colors duration-300">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-orange-500/10 dark:bg-orange-500/5 blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[60%] rounded-full bg-orange-600/10 dark:bg-orange-600/5 blur-[120px]" />
      </div>

      {/* Header with Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-4 z-10 w-full max-w-6xl mx-auto py-12">
        
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center w-full">
          
          {/* Left Side - Brand/Hero area */}
          <div className="hidden lg:flex flex-col space-y-8 max-w-lg order-2 lg:order-1">
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
                Start your <br />learning journey.
              </h1>
              <p className="text-lg pb-4">
                Create an account to access personalized quizzes, track your progress over time, and master new skills with AI-driven insights.
              </p>
              
              <div className="space-y-4 pt-4">
                {[
                  { title: "Adaptive Quizzes", desc: "Questions that adjust to your skill level" },
                  { title: "Detailed Analytics", desc: "Track your strengths and weaknesses" },
                  { title: "AI Explanations", desc: "Understand the 'why' behind every answer" }
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="mt-1 bg-orange-100 dark:bg-orange-500/20 p-1 rounded-full">
                     <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-900 dark:text-white">{feature.title}</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Register Form */}
          <div className="flex justify-center w-full order-1 lg:order-2">
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
                <CardTitle className="text-2xl lg:text-3xl font-bold">Create an account</CardTitle>
                <CardDescription className="text-base text-zinc-500 dark:text-zinc-400">
                  Enter your details to generate your account
                </CardDescription>
              </CardHeader>
              
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <p>{error}</p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-zinc-700 dark:text-zinc-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="name">
                      Full Name
                    </label>
                    <Input 
                      id="name" 
                      type="text" 
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-11 bg-zinc-50 dark:bg-zinc-950/50"
                    />
                  </div>
                  
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
                      className="h-11 bg-zinc-50 dark:bg-zinc-950/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-zinc-700 dark:text-zinc-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                      Password
                    </label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 bg-zinc-50 dark:bg-zinc-950/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-zinc-700 dark:text-zinc-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="confirmPassword">
                      Confirm Password
                    </label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="h-11 bg-zinc-50 dark:bg-zinc-950/50"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 pt-2">
                  <Button 
                    type="submit" 
                    className="w-full h-11 text-base bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-lg shadow-orange-500/25 group"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-center text-zinc-500 dark:text-zinc-400 my-2">
                    By clicking continue, you agree to our <Link to="#" className="underline hover:text-zinc-900 dark:hover:text-white">Terms of Service</Link> and <Link to="#" className="underline hover:text-zinc-900 dark:hover:text-white">Privacy Policy</Link>.
                  </p>
                  
                </CardFooter>
              </form>
            </Card>
          </div>
          
        </div>
      </div>
    </div>
  );
}
