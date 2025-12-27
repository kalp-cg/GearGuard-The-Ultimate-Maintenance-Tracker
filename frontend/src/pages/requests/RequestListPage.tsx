import { useState, useEffect } from 'react';
import { getRequests } from '../../api/requests';
import type { MaintenanceRequest, RequestStatus } from '../../types';
import { Button } from '../../components/common/Button';
import { Plus } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { cn } from '../../lib/utils';
import CreateRequestModal from '../../components/requests/CreateRequestModal';

export default function RequestListPage() {
    const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchParams] = useSearchParams();

    const equipmentId = searchParams.get('equipmentId') || undefined;
    const statusFilter = searchParams.get('status') as RequestStatus || undefined;

    useEffect(() => {
        loadRequests();
    }, [equipmentId, statusFilter]);

    const loadRequests = async () => {
        setIsLoading(true);
        try {
            const data = await getRequests({ equipmentId, status: statusFilter });
            setRequests(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Maintenance Requests</h1>
                    <p className="text-muted-foreground">Track and manage all maintenance activities.</p>
                </div>
                <div className="flex gap-2">
                    <Link to="/requests/kanban">
                        <Button variant="outline">Kanban Board</Button>
                    </Link>
                    <Link to="/requests/calendar">
                        <Button variant="outline">Calendar</Button>
                    </Link>
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Request
                    </Button>
                </div>
            </div>

            <CreateRequestModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={loadRequests}
                preselectedEquipmentId={equipmentId}
            />

            {/* List / Table */}
            <div className="rounded-md border border-border bg-card">
                <div className="w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Subject</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Equipment</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Team</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Priority</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Assignee</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={7} className="text-center h-24">Loading...</td></tr>
                            ) : requests.length === 0 ? (
                                <tr><td colSpan={7} className="text-center h-24 text-muted-foreground">No requests found.</td></tr>
                            ) : (
                                requests.map(req => (
                                    <tr key={req.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 font-medium">{req.subject}</td>
                                        <td className="p-4">
                                            <span className={cn(
                                                "px-2 py-1 rounded text-xs font-semibold",
                                                req.requestType === 'PREVENTIVE' ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"
                                            )}>{req.requestType}</span>
                                        </td>
                                        <td className="p-4">
                                            <Link to={`/equipment/${req.equipmentId}`} className="hover:underline text-primary">
                                                {req.equipment?.name}
                                            </Link>
                                        </td>
                                        <td className="p-4">{req.team?.name}</td>
                                        <td className="p-4">
                                            <span className={cn(
                                                "px-2 py-1 rounded-full text-xs font-medium border",
                                                req.status === 'NEW' && "bg-gray-100 border-gray-200 text-gray-800",
                                                req.status === 'IN_PROGRESS' && "bg-blue-100 border-blue-200 text-blue-800",
                                                req.status === 'REPAIRED' && "bg-green-100 border-green-200 text-green-800",
                                                req.status === 'SCRAP' && "bg-red-100 border-red-200 text-red-800",
                                            )}>
                                                {req.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={cn(
                                                "font-medium",
                                                req.priority === 'URGENT' ? "text-red-600 font-bold" :
                                                    req.priority === 'HIGH' ? "text-orange-600" : "text-muted-foreground"
                                            )}>{req.priority}</span>
                                        </td>
                                        <td className="p-4 text-muted-foreground">
                                            {req.assignedTo ? `${req.assignedTo.firstName} ${req.assignedTo.lastName}` : 'Unassigned'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
