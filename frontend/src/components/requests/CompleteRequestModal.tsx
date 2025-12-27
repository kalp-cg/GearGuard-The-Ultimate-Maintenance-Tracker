import { useState } from 'react';
import { completeRequest } from '../../api/requests';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { X } from 'lucide-react';

interface CompleteRequestModalProps {
    isOpen: boolean;
    requestId: string | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CompleteRequestModal({ isOpen, requestId, onClose, onSuccess }: CompleteRequestModalProps) {
    const [loading, setLoading] = useState(false);
    const [duration, setDuration] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!requestId) return;

        setLoading(true);
        try {
            await completeRequest(requestId, {
                durationHours: parseFloat(duration),
                notes,
            });
            onSuccess();
            onClose();
            setDuration('');
            setNotes('');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card w-full max-w-md rounded-lg border border-border shadow-lg p-6 relative animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                >
                    <X className="h-4 w-4" />
                </button>

                <h2 className="text-xl font-bold mb-4">Complete Request</h2>
                <p className="text-sm text-muted-foreground mb-4">
                    Please log the duration of work before marking as completed.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Duration (Hours)"
                        type="number"
                        step="0.1"
                        value={duration}
                        onChange={e => setDuration(e.target.value)}
                        required
                        placeholder="e.g. 1.5"
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Completion Notes (Optional)</label>
                        <textarea
                            className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Describe what was done..."
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" isLoading={loading}>Complete & Close</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
