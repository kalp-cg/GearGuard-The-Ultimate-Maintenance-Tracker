import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { getDepartments, createDepartment, deleteDepartment, updateDepartment } from '../../api/departments';
import type { Department } from '../../types';
import { Building, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function DepartmentsPage() {
    const { user } = useAuthStore();
    const isAdmin = user?.role === 'ADMIN';

    const [departments, setDepartments] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '', location: '' });

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        try {
            const data = await getDepartments();
            setDepartments(data);
        } catch (error) {
            console.error('Failed to load departments', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingDepartment) {
                await updateDepartment(editingDepartment.id, formData);
            } else {
                await createDepartment(formData);
            }
            setIsModalOpen(false);
            setEditingDepartment(null);
            setFormData({ name: '', description: '', location: '' });
            loadDepartments();
        } catch (error) {
            console.error('Failed to save department', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            try {
                await deleteDepartment(id);
                loadDepartments();
            } catch (error) {
                console.error('Failed to delete department', error);
            }
        }
    };

    const openEditModal = (department: Department) => {
        setEditingDepartment(department);
        setFormData({
            name: department.name,
            description: department.description || '',
            location: department.location || ''
        });
        setIsModalOpen(true);
    };

    const filteredDepartments = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
                    <p className="text-muted-foreground">Manage organization departments and locations.</p>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => {
                            setEditingDepartment(null);
                            setFormData({ name: '', description: '', location: '' });
                            setIsModalOpen(true);
                        }}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Department
                    </button>
                )}
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="search"
                        placeholder="Search departments..."
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredDepartments.map((dept) => (
                        <div key={dept.id} className="rounded-lg border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Building className="h-5 w-5 text-primary" />
                                    </div>
                                    {isAdmin && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEditModal(dept)}
                                                className="h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(dept.id)}
                                                className="h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <h3 className="font-semibold text-lg mb-1">{dept.name}</h3>
                                <div className="space-y-2">
                                    {dept.location && (
                                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                                            <span className="font-medium">Location:</span> {dept.location}
                                        </p>
                                    )}
                                    {dept.description && (
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {dept.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredDepartments.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-lg border-muted">
                            <Building className="h-8 w-8 text-muted-foreground/50 mb-2" />
                            <p className="text-muted-foreground">No departments found.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Create/Edit Modal directly embedded for simplicity */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 m-4 animate-in fade-in zoom-in-95 duration-200">
                        <h2 className="text-lg font-semibold mb-4">
                            {editingDepartment ? 'Edit Department' : 'Create Department'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Department Name</label>
                                <input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="e.g. IT Infrastructure"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Location (Optional)</label>
                                <input
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="e.g. Building A, Floor 2"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description (Optional)</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Brief description of responsibilities..."
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                                >
                                    {editingDepartment ? 'Save Changes' : 'Create Department'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
