import { useAuthStore } from '../../store/useAuthStore';
import { Bell, Search } from 'lucide-react';


export default function Header() {
    const { user } = useAuthStore();

    return (
        <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between sticky top-0 z-10">
            <div className="w-96">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full h-9 pl-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2 text-muted-foreground hover:bg-accent rounded-full transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full" />
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-border">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-medium leading-none">
                            {user?.firstName} {user?.lastName}
                        </span>
                        <span className="text-xs text-muted-foreground capitalize">
                            {user?.role?.toLowerCase()}
                        </span>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                </div>
            </div>
        </header>
    );
}
