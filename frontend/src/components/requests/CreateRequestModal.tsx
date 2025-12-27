import { useState, useEffect } from 'react';
import { createRequest } from '../../api/requests';
import { getEquipment } from '../../api/equipment';
import type { Equipment, RequestType, Priority } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { X } from 'lucide-react';

interface CreateRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    preselectedEquipmentId?: string;
}

export default function CreateRequestModal({ isOpen, onClose, onSuccess, preselectedEquipmentId }: CreateRequestModalProps) {
    const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState(false);

    // Form State
    const [subject, setSubject] = useState('');
    const [equipmentId, setEquipmentId] = useState(preselectedEquipmentId || '');
    const [requestType, setRequestType] = useState<RequestType>('CORRECTIVE');
    const [priority, setPriority] = useState<Priority>('MEDIUM');
    const [description, setDescription] = useState('');
    const [scheduledDate, setScheduledDate] = useState('');

    useEffect(() => {
        if (isOpen) {
            loadEquipment();
            if (preselectedEquipmentId) setEquipmentId(preselectedEquipmentId);
        }
    }, [isOpen, preselectedEquipmentId]);

    const loadEquipment = async () => {
        const data = await getEquipment();
        setEquipmentList(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createRequest({
                subject,
                equipmentId,
                requestType,
                priority,
                description,
                scheduledDate: scheduledDate || undefined,
            });
            onSuccess();
            onClose();
            // Reset form
            setSubject('');
            setDescription('');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card w-full max-w-lg rounded-lg border border-border shadow-lg p-6 relative animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                >
                    <X className="h-4 w-4" />
                </button>

                <h2 className="text-xl font-bold mb-4">Create Maintenance Request</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Subject"
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        required
                        placeholder="e.g. Hydraulic Leak"
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Equipment</label>
                        <select
                            className="w-full h-10 rounded-md border border-input bg-background px-3"
                            value={equipmentId}
                            onChange={e => setEquipmentId(e.target.value)}
                            required
                        >
                            <option value="">Select Equipment</option>
                            {equipmentList.map(eq => (
                                <option key={eq.id} value={eq.id}>{eq.name} ({eq.serialNumber})</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Type</label>
                            <select
                                className="w-full h-10 rounded-md border border-input bg-background px-3"
                                value={requestType}
                                onChange={e => setRequestType(e.target.value as RequestType)}
                            >
                                <option value="CORRECTIVE">Corrective (Breakdown)</option>
                                <option value="PREVENTIVE">Preventive (Routine)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Priority</label>
                            <select
                                className="w-full h-10 rounded-md border border-input bg-background px-3"
                                value={priority}
                                onChange={e => setPriority(e.target.value as Priority)}
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="URGENT">Urgent</option>
                            </select>
                        </div>
                    </div>

                    {requestType === 'PREVENTIVE' && (
                        <Input
                            label="Scheduled Date"
                            type="date"
                            value={scheduledDate}
                            onChange={e => setScheduledDate(e.target.value)}
                            required
                        />
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Describe the issue..."
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" isLoading={loading}>Create Request</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
