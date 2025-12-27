import { useState, useEffect } from 'react';
import { getEquipment } from '../../api/equipment';
import { getDepartments } from '../../api/departments';
import type { Equipment, Department } from '../../types';
import { Input } from '../../components/common/Input';
import { Search, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';

export default function EquipmentListPage() {
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState('');
    const [departmentId, setDepartmentId] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    // Reload when filters change (with debounce logic normally, but here simple effect)
    useEffect(() => {
        const timer = setTimeout(() => {
            loadEquipment();
        }, 300);
        return () => clearTimeout(timer);
    }, [search, departmentId]);

    const loadData = async () => {
        try {
            const [equips, depts] = await Promise.all([
                getEquipment(),
                getDepartments()
            ]);
            setEquipment(equips);
            setDepartments(depts);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadEquipment = async () => {
        try {
            const data = await getEquipment({ search, departmentId });
            setEquipment(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Equipment</h1>
                    <p className="text-muted-foreground">Manage assets and track maintenance history.</p>
                </div>

                {/* Actions if needed, e.g. Add Equipment */}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-lg border border-border">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or serial..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="w-full sm:w-[200px]">
                    <select
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={departmentId}
                        onChange={(e) => setDepartmentId(e.target.value)}
                    >
                        <option value="">All Departments</option>
                        {departments.map((dept) => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* List */}
            <div className="rounded-md border border-border bg-card">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Serial No.</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Department</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Warranty</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="h-24 text-center">Loading...</td>
                                </tr>
                            ) : equipment.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="h-24 text-center text-muted-foreground">No equipment found.</td>
                                </tr>
                            ) : (
                                equipment.map((item) => (
                                    <tr key={item.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle font-medium">
                                            <Link to={`/equipment/${item.id}`} className="hover:underline flex items-center gap-2">
                                                <Wrench className="h-4 w-4 text-muted-foreground" />
                                                {item.name}
                                            </Link>
                                        </td>
                                        <td className="p-4 align-middle">{item.serialNumber}</td>
                                        <td className="p-4 align-middle capitalize">{item.category.toLowerCase()}</td>
                                        <td className="p-4 align-middle">{item.department?.name || '-'}</td>
                                        <td className="p-4 align-middle">
                                            <span className={cn(
                                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                                item.status === 'ACTIVE' && "bg-green-100 text-green-800",
                                                item.status === 'INACTIVE' && "bg-yellow-100 text-yellow-800",
                                                item.status === 'SCRAPPED' && "bg-red-100 text-red-800",
                                            )}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle">
                                            {item.warrantyExpiry && (
                                                <span className={cn(
                                                    "text-xs",
                                                    new Date(item.warrantyExpiry) < new Date() ? "text-destructive font-bold" : "text-green-600"
                                                )}>
                                                    {new Date(item.warrantyExpiry) < new Date() ? "EXPIRED" : format(new Date(item.warrantyExpiry), 'MMM d, yyyy')}
                                                </span>
                                            )}
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
