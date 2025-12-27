import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import {
    LayoutDashboard,
    Wrench,
    Users,
    ClipboardList,
    Settings,
    LogOut,
    BarChart3,
    Building,
    Package
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Equipment', href: '/equipment', icon: Wrench },
    { name: 'Requests', href: '/requests', icon: ClipboardList },
    { name: 'Reports', href: '/requests/reports', icon: BarChart3 },
    { name: 'Teams', href: '/teams', icon: Users },
    { name: 'Departments', href: '/departments', icon: Building },
    { name: 'Inventory', href: '/inventory/parts', icon: Package },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
    const location = useLocation();
    const { logout } = useAuthStore();
    const { user } = useAuthStore();

    return (
        <div className="flex h-full w-64 flex-col bg-[#714B67] text-white border-r border-[#5d3d54]">
            <div className="flex h-16 items-center px-6 border-b border-[#5d3d54] bg-[#5d3d54]/30">
                <Wrench className="h-6 w-6 text-white/90 mr-2" />
                <span className="text-lg font-bold tracking-tight">GearGuard</span>
            </div>

            <div className="flex-1 flex flex-col gap-1 p-2 overflow-y-auto">
                <div className="text-[10px] font-bold text-white/50 mb-2 px-3 uppercase tracking-wider mt-4">
                    Menu
                </div>
                {navigation.map((item) => {
                    const isActive = location.pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-sm transition-colors",
                                isActive
                                    ? "bg-white/10 text-white shadow-sm"
                                    : "text-white/70 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-[#5d3d54] bg-[#5d3d54]/10">
                <div className="mb-4 px-2">
                    <p className="text-sm font-medium text-white">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-white/50 capitalize">{user?.role?.toLowerCase()}</p>
                </div>
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-white/70 hover:bg-red-500/20 hover:text-red-100 rounded-sm transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    Sign out
                </button>
            </div>
        </div>
    );
}
