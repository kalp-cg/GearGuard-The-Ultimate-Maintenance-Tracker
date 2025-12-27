import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { getRequests, updateRequestStatus } from '../../api/requests';
import type { MaintenanceRequest, RequestStatus } from '../../types';
import { cn } from '../../lib/utils';
import { Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import CompleteRequestModal from '../../components/requests/CompleteRequestModal';

const columns: { id: RequestStatus; title: string, color: string }[] = [
    { id: 'NEW', title: 'New Requests', color: 'bg-gray-100' },
    { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-blue-100' },
    { id: 'REPAIRED', title: 'Repaired', color: 'bg-green-100' },
    { id: 'SCRAP', title: 'Scrap', color: 'bg-red-100' },
];

export default function KanbanBoard() {
    const [columnsData, setColumnsData] = useState<Record<RequestStatus, MaintenanceRequest[]>>({
        NEW: [],
        IN_PROGRESS: [],
        REPAIRED: [],
        SCRAP: [],
    });
    const [isLoading, setIsLoading] = useState(true);

    // Modal State
    const [completionModalOpen, setCompletionModalOpen] = useState(false);
    const [completingRequestId, setCompletingRequestId] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await getRequests();
            distributeToColumns(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const distributeToColumns = (data: MaintenanceRequest[]) => {
        const cols: Record<RequestStatus, MaintenanceRequest[]> = {
            NEW: [],
            IN_PROGRESS: [],
            REPAIRED: [],
            SCRAP: [],
        };
        data.forEach(req => {
            if (cols[req.status]) {
                cols[req.status].push(req);
            }
        });
        setColumnsData(cols);
    };

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const startStatus = source.droppableId as RequestStatus;
        const endStatus = destination.droppableId as RequestStatus;

        // INTERCEPTION: If moving to REPAIRED, stop and show modal
        if (endStatus === 'REPAIRED' && startStatus !== 'REPAIRED') {
            setCompletingRequestId(draggableId);
            setCompletionModalOpen(true);
            return; // Do NOT update state yet. 
        }

        // Normal move (Optimistic update)
        const startCol = Array.from(columnsData[startStatus]);
        const endCol = Array.from(columnsData[endStatus]);
        const [movedItem] = startCol.splice(source.index, 1);

        // Create updated item
        const updatedItem = { ...movedItem, status: endStatus };

        if (startStatus === endStatus) {
            startCol.splice(destination.index, 0, updatedItem);
            setColumnsData({ ...columnsData, [startStatus]: startCol });
        } else {
            endCol.splice(destination.index, 0, updatedItem);
            setColumnsData({
                ...columnsData,
                [startStatus]: startCol,
                [endStatus]: endCol,
            });

            // API Call
            try {
                await updateRequestStatus(draggableId, endStatus);
            } catch (error) {
                console.error("Failed to move item", error);
                loadData(); // Revert on failure
            }
        }
    };

    const onCompletionSuccess = () => {
        // Reload full data to ensure correct state after completion
        loadData();
    };

    if (isLoading) return <div className="p-8 text-center">Loading Kanban options...</div>;

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Maintenance Kanban</h1>
                <Link to="/requests" className="text-sm text-primary hover:underline">View as List</Link>
            </div>

            <CompleteRequestModal
                isOpen={completionModalOpen}
                requestId={completingRequestId}
                onClose={() => setCompletionModalOpen(false)}
                onSuccess={onCompletionSuccess}
            />

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex h-full gap-4 overflow-x-auto pb-4">
                    {columns.map((column) => (
                        <div key={column.id} className="w-80 flex-shrink-0 flex flex-col bg-muted/50 rounded-lg border border-border">
                            <div className={cn("p-3 font-semibold border-b border-border flex justify-between", column.color)}>
                                {column.title}
                                <span className="bg-background/50 px-2 rounded-full text-xs flex items-center">{columnsData[column.id].length}</span>
                            </div>

                            <Droppable droppableId={column.id}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="flex-1 p-3 space-y-3 overflow-y-auto min-h-[500px]"
                                    >
                                        {columnsData[column.id].map((req, index) => (
                                            <Draggable key={req.id} draggableId={req.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={cn(
                                                            "bg-card p-4 rounded-md shadow-sm border border-border group hover:border-primary/50 transition-colors relative overflow-hidden",
                                                            snapshot.isDragging && "shadow-lg ring-2 ring-primary rotate-2",
                                                            // Overdue Logic: If Scheduled Date < Now AND status is NEW or IN_PROGRESS
                                                            (req.scheduledDate && new Date(req.scheduledDate) < new Date() && (req.status === 'NEW' || req.status === 'IN_PROGRESS')) && "border-l-4 border-l-destructive"
                                                        )}
                                                        style={provided.draggableProps.style}
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className={cn(
                                                                "text-[10px] font-bold px-1.5 py-0.5 rounded uppercase",
                                                                req.priority === 'URGENT' ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
                                                            )}>
                                                                {req.priority}
                                                            </span>
                                                            <span className="text-[10px] text-muted-foreground">{req.requestType}</span>
                                                        </div>

                                                        {/* Overdue Text Indicator */}
                                                        {(req.scheduledDate && new Date(req.scheduledDate) < new Date() && (req.status === 'NEW' || req.status === 'IN_PROGRESS')) && (
                                                            <div className="text-[10px] font-bold text-destructive mb-1 uppercase tracking-wider">Overdue</div>
                                                        )}

                                                        <h4 className="font-medium text-sm mb-1 group-hover:text-primary">{req.subject}</h4>
                                                        <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                                                            <Wrench className="h-3 w-3" />
                                                            {req.equipment?.name || 'Unknown Asset'}
                                                        </p>

                                                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-border/50">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                                                    {req.assignedTo
                                                                        ? `${req.assignedTo.firstName[0]}${req.assignedTo.lastName[0]}`
                                                                        : '?'
                                                                    }
                                                                </div>
                                                                <span className="text-xs text-muted-foreground truncate max-w-[80px]">
                                                                    {req.assignedTo ? req.assignedTo.firstName : 'Unassigned'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}
