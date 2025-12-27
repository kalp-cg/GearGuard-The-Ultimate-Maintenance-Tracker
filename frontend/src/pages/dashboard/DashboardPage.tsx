import { useState, useEffect } from 'react';
import { getEquipment } from '../../api/equipment';
import { getRequests } from '../../api/requests';
import { getTeams } from '../../api/teams';
import { Wrench, Users, ClipboardList, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';
import type { MaintenanceRequest } from '../../types';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        equipmentCount: 0,
        activeRequests: 0,
        teamCount: 0,
        urgentRequests: 0
    });
    const [recentRequests, setRecentRequests] = useState<MaintenanceRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [equip, reqs, teams] = await Promise.all([
                getEquipment(),
                getRequests(),
                getTeams()
            ]);

            const active = reqs.filter(r => r.status !== 'REPAIRED' && r.status !== 'SCRAP');
            const urgent = active.filter(r => r.priority === 'URGENT');

            setStats({
                equipmentCount: equip.length,
                activeRequests: active.length,
                teamCount: teams.length,
                urgentRequests: urgent.length
            });

            // Get 5 most recent requests
            setRecentRequests(reqs.slice(0, 5));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="p-8 text-center pt-20">Loading Dashboard...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                <p className="text-muted-foreground">Welcome back to GearGuard.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Assets"
                    value={stats.equipmentCount}
                    icon={<Wrench className="h-6 w-6 text-blue-600" />}
                    className="bg-blue-50 border-blue-100"
                    link="/equipment"
                />
                <StatsCard
                    title="Active Requests"
                    value={stats.activeRequests}
                    icon={<ClipboardList className="h-6 w-6 text-orange-600" />}
                    className="bg-orange-50 border-orange-100"
                    link="/requests"
                />
                <StatsCard
                    title="Urgent Attention"
                    value={stats.urgentRequests}
                    icon={<Activity className="h-6 w-6 text-red-600" />}
                    className="bg-red-50 border-red-100"
                    link="/requests?status=URGENT" // Ideally we'd support filter logic
                />
                <StatsCard
                    title="Maintenance Teams"
                    value={stats.teamCount}
                    icon={<Users className="h-6 w-6 text-green-600" />}
                    className="bg-green-50 border-green-100"
                    link="/teams"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                    <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
                        <h3 className="font-semibold text-lg">Recent Requests</h3>
                        <Link to="/requests" className="text-sm text-primary hover:underline">View All</Link>
                    </div>
                    <div className="divide-y divide-border">
                        {recentRequests.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">No recent activity.</div>
                        ) : (
                            recentRequests.map(req => (
                                <div key={req.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                                    <div>
                                        <div className="font-medium text-sm mb-1">{req.subject}</div>
                                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                                            <span className={cn(
                                                "px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase",
                                                req.status === 'NEW' && "bg-gray-200",
                                                req.status === 'IN_PROGRESS' && "bg-blue-200 text-blue-800",
                                                req.status === 'REPAIRED' && "bg-green-200 text-green-800",
                                            )}>{req.status.replace('_', ' ')}</span>
                                            <span>•</span>
                                            <span>{req.equipment?.name}</span>
                                        </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {req.createdAt ? format(new Date(req.createdAt), 'MMM d') : ''}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Actions / Placeholder */}
                <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-border bg-muted/30">
                        <h3 className="font-semibold text-lg">Quick Actions</h3>
                    </div>
                    <div className="p-6 grid grid-cols-2 gap-4 flex-1">
                        <Link to="/requests/kanban" className="flex flex-col items-center justify-center p-6 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors group">
                            <div className="bg-primary/10 p-4 rounded-full mb-3 group-hover:bg-primary/20">
                                <ClipboardList className="h-8 w-8 text-primary" />
                            </div>
                            <span className="font-medium">Kanban Board</span>
                        </Link>
                        <Link to="/requests/calendar" className="flex flex-col items-center justify-center p-6 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors group">
                            <div className="bg-primary/10 p-4 rounded-full mb-3 group-hover:bg-primary/20">
                                <Activity className="h-8 w-8 text-primary" />
                            </div>
                            <span className="font-medium">Preventive Calendar</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon, className, link }: any) {
    return (
        <Link to={link || '#'} className={cn("p-6 rounded-lg border flex items-center gap-4 transition-transform hover:scale-105", className)}>
            <div className="h-12 w-12 rounded-full bg-white/50 flex items-center justify-center border border-black/5 shadow-sm">
                {icon}
            </div>
            <div>
                <p className="text-sm text-muted-foreground font-medium">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </Link>
    );
}
