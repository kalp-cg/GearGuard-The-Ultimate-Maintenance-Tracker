import { useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { User, Bell, Shield } from 'lucide-react';


export default function SettingsPage() {
    const { user } = useAuthStore();

    // Enforce light mode
    useEffect(() => {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your account and application preferences.</p>
            </div>

            <div className="grid gap-6">
                {/* Profile Section */}
                <div className="rounded-lg border border-border bg-card">
                    <div className="p-6 border-b border-border">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Profile Information
                        </h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                                {user?.firstName?.[0] || 'U'}
                            </div>
                            <div>
                                <h3 className="font-bold">{user?.firstName} {user?.lastName}</h3>
                                <p className="text-sm text-muted-foreground">{user?.email}</p>
                                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 mt-2">
                                    {user?.role || 'USER'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preferences Section */}
                <div className="rounded-lg border border-border bg-card">
                    <div className="p-6 border-b border-border">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Preferences
                        </h2>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    <div className="flex items-center gap-2">
                                        <Bell className="h-4 w-4" />
                                        Notifications
                                    </div>
                                </label>
                                <p className="text-sm text-muted-foreground">Receive email updates about maintenance requests.</p>
                            </div>
                            <div className="h-6 w-11 rounded-full bg-primary p-1 cursor-pointer">
                                <div className="h-4 w-4 rounded-full bg-white transform translate-x-5 transition-transform" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
