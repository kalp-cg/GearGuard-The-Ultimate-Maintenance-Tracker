import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Wrench, ArrowRight, User as UserIcon, Check } from 'lucide-react';
import type { UserRole } from '../../types';

export default function RegisterPage() {
    const [step, setStep] = useState<1 | 2>(1);
    const [selectedRole, setSelectedRole] = useState<UserRole>('TECHNICIAN');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const { register, isLoading, error, clearError } = useAuthStore();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) clearError();
    };

    const handleRoleSelect = (role: UserRole) => {
        setSelectedRole(role);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register({
                ...formData,
                role: selectedRole
            });
            // Navigate to verification page with email
            navigate('/verify-email', { state: { email: formData.email } });
        } catch (err: any) {
            console.error("Registration failed:", err);
        }
    };

    const roles = [
        { id: 'TECHNICIAN', label: 'Technician', icon: Wrench, desc: 'Execute & track work orders' },
        { id: 'USER', label: 'Employee', icon: UserIcon, desc: 'Report issues & track status' },
    ] as const;

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-background">
            {/* Left Side - Form */}
            <div className="flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight">Create an account</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {step === 1 ? 'Select your role to get started' : 'Enter your details'}
                        </p>
                    </div>

                    {step === 1 ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                {roles.map((role) => {
                                    const Icon = role.icon;
                                    const isSelected = selectedRole === role.id;
                                    return (
                                        <div
                                            key={role.id}
                                            onClick={() => handleRoleSelect(role.id as UserRole)}
                                            className={`
                                                relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:border-primary/50
                                                ${isSelected ? 'border-primary bg-primary/5' : 'border-border bg-card'}
                                            `}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`
                                                    h-10 w-10 rounded-lg flex items-center justify-center
                                                    ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                                                `}>
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold">{role.label}</h3>
                                                    <p className="text-sm text-muted-foreground">{role.desc}</p>
                                                </div>
                                                {isSelected && (
                                                    <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                                                        <Check className="h-4 w-4" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <Button className="w-full mt-6" size="lg" onClick={() => setStep(2)}>
                                Continue as {roles.find(r => r.id === selectedRole)?.label}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-right duration-300">
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="First Name"
                                    name="firstName"
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="Last Name"
                                    name="lastName"
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <Input
                                label="Email"
                                name="email"
                                type="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                label="Password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />

                            {error && (
                                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-3">
                                <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>
                                    Back
                                </Button>
                                <Button type="submit" className="flex-[2]" isLoading={isLoading}>
                                    Create Account
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </form>
                    )}

                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-primary hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Side - Visuals */}
            <div className="hidden lg:flex flex-col justify-center bg-muted p-12 text-foreground relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-background/0" />
                <div className="relative z-10 max-w-lg">
                    <h1 className="text-4xl font-bold mb-6">
                        {step === 1 ? 'Choose your path' : 'Almost there'}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        {step === 1
                            ? 'Select the role that best describes your position in the organization.'
                            : 'Complete your registration to access the platform.'}
                    </p>
                </div>
            </div>
        </div>
    );
}
