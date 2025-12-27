import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEquipmentById, getEquipmentRequestsCount } from '../../api/equipment';
import type { Equipment } from '../../types';
import { Button } from '../../components/common/Button';
import {
    ArrowLeft,
    MapPin,
    Calendar,
    ShieldCheck,
    ShieldAlert,
    Users,
    ClipboardList
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';

export default function EquipmentDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [equipment, setEquipment] = useState<Equipment | null>(null);
    const [requestCount, setRequestCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadData(id);
        }
    }, [id]);

    const loadData = async (equipId: string) => {
        setIsLoading(true);
        try {
            const equip = await getEquipmentById(equipId);
            const countData = await getEquipmentRequestsCount(equipId);
            setEquipment(equip);
            setRequestCount(countData.count);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="p-8 text-center">Loading equipment details...</div>;
    if (!equipment) return <div className="p-8 text-center text-destructive">Equipment not found.</div>;

    const isWarrantyExpired = equipment.warrantyExpiry
        ? new Date(equipment.warrantyExpiry) < new Date()
        : false;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <Button variant="ghost" className="pl-0 gap-2" onClick={() => navigate('/equipment')}>
                <ArrowLeft className="h-4 w-4" />
                Back to Equipment
            </Button>

            {/* Header with Smart Button */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{equipment.name}</h1>
                    <p className="text-muted-foreground font-mono mt-1">SN: {equipment.serialNumber}</p>
                </div>

                {/* Smart Button */}
                <Button
                    variant="outline"
                    className="h-14 px-6 border-primary/20 bg-primary/5 hover:bg-primary/10 relative overflow-visible"
                    onClick={() => navigate(`/requests?equipmentId=${equipment.id}`)}
                >
                    <div className="flex flex-col items-center mr-4">
                        <ClipboardList className="h-5 w-5 text-primary" />
                        <span className="text-xs font-semibold text-primary">Maintenance</span>
                    </div>
                    <div className="flex flex-col items-start border-l border-primary/20 pl-4">
                        <span className="text-2xl font-bold text-primary leading-none">{requestCount}</span>
                        <span className="text-[10px] uppercase text-muted-foreground tracking-wider">Open Requests</span>
                    </div>

                    {/* Badge indicator if there are requests */}
                    {requestCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-destructive"></span>
                        </span>
                    )}
                </Button>
            </div>

            {/* Main Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card 1: Status & Location */}
                <div className="p-6 rounded-lg border border-border bg-card space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2 border-b border-border pb-2">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        Location & Status
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Location</span>
                            <span className="font-medium">{equipment.location}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Category</span>
                            <span className="font-medium capitalize">{equipment.category.toLowerCase()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Status</span>
                            <span className={cn(
                                "px-2.5 py-0.5 rounded-full text-xs font-semibold",
                                equipment.status === 'ACTIVE' && "bg-green-100 text-green-800",
                                equipment.status === 'INACTIVE' && "bg-yellow-100 text-yellow-800",
                                equipment.status === 'SCRAPPED' && "bg-red-100 text-red-800",
                            )}>
                                {equipment.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Card 2: Ownership */}
                <div className="p-6 rounded-lg border border-border bg-card space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2 border-b border-border pb-2">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        Ownership
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Department</span>
                            <span className="font-medium">{equipment.department?.name || 'Unassigned'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Maintenance Team</span>
                            <span className="font-medium text-primary cursor-pointer hover:underline" onClick={() => navigate('/teams')}>
                                {equipment.maintenanceTeam?.name || 'Unassigned'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Card 3: Warranty & Purchase */}
                <div className="p-6 rounded-lg border border-border bg-card space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2 border-b border-border pb-2">
                        {isWarrantyExpired ? <ShieldAlert className="h-5 w-5 text-destructive" /> : <ShieldCheck className="h-5 w-5 text-green-600" />}
                        Warranty Info
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Purchase Date</span>
                            <span className="font-medium flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(equipment.purchaseDate), 'MMM d, yyyy')}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Warranty Expiry</span>
                            <span className={cn(
                                "font-medium flex items-center gap-2",
                                isWarrantyExpired ? "text-destructive" : "text-green-600"
                            )}>
                                <Calendar className="h-3 w-3" />
                                {equipment.warrantyExpiry ? format(new Date(equipment.warrantyExpiry), 'MMM d, yyyy') : 'N/A'}
                            </span>
                        </div>
                        {isWarrantyExpired && (
                            <div className="mt-2 p-2 bg-destructive/10 text-destructive text-xs rounded text-center font-semibold">
                                Warranty Expired
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
