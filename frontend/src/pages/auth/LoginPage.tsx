import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Wrench, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error, clearError } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ email, password });
            navigate('/dashboard');
        } catch (err) {
            // Error handled by store
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-background">
            {/* Left Side - Form */}
            <div className="flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <div className="mx-auto h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                            <Wrench className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Sign in to your GearGuard account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <Input
                                label="Email"
                                type="email"
                                placeholder="technician@gearguard.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (error) clearError();
                                }}
                                required
                            />
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (error) clearError();
                                }}
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                            Sign in
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>

                        <p className="text-center text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium text-primary hover:underline">
                                Create one
                            </Link>
                        </p>
                    </form>
                </div>
            </div>

            {/* Right Side - Visual */}
            <div className="hidden lg:flex flex-col justify-center bg-muted p-12 text-foreground relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background/0" />
                <div className="relative z-10 max-w-lg">
                    <h1 className="text-4xl font-bold mb-6">The Ultimate Maintenance Tracker</h1>
                    <p className="text-lg text-muted-foreground">
                        Streamline your equipment management, track maintenance requests, and optimize your team's workflow with GearGuard.
                    </p>

                    <div className="mt-12 grid grid-cols-2 gap-4">
                        <div className="bg-background/50 backdrop-blur p-4 rounded-lg border border-border/50">
                            <div className="text-2xl font-bold text-primary mb-1">99%</div>
                            <div className="text-sm text-muted-foreground">Uptime Guaranteed</div>
                        </div>
                        <div className="bg-background/50 backdrop-blur p-4 rounded-lg border border-border/50">
                            <div className="text-2xl font-bold text-primary mb-1">24/7</div>
                            <div className="text-sm text-muted-foreground">Real-time Monitoring</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
