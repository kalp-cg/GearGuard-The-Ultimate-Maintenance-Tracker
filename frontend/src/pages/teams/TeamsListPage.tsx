import { useState, useEffect } from 'react';
import { getTeams } from '../../api/teams';
import type { MaintenanceTeam } from '../../types';
import { Users, User as UserIcon } from 'lucide-react';

export default function TeamsListPage() {
    const [teams, setTeams] = useState<MaintenanceTeam[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadTeams();
    }, []);

    const loadTeams = async () => {
        try {
            const data = await getTeams();
            setTeams(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Maintenance Teams</h1>
                <p className="text-muted-foreground">Manage your maintenance crews and technicians.</p>
            </div>

            {isLoading ? (
                <div className="text-center p-12">Loading teams...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teams.map((team) => (
                        <div key={team.id} className="bg-card rounded-lg border border-border overflow-hidden">
                            <div className="p-6 border-b border-border">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Users className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{team.name}</h3>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">{team.specialty}</p>
                                    </div>
                                </div>
                                {team.description && (
                                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{team.description}</p>
                                )}
                            </div>

                            <div className="p-4 bg-muted/20">
                                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-3 px-2">Team Members</h4>
                                <div className="space-y-2">
                                    {team.members && team.members.length > 0 ? (
                                        team.members.map((member) => (
                                            <div key={member.id} className="flex items-center gap-3 p-2 rounded hover:bg-background/50 transition-colors">
                                                <div className="h-8 w-8 rounded-full bg-background border border-border flex items-center justify-center">
                                                    {member.avatar ? (
                                                        <img src={member.avatar} alt={member.firstName} className="h-full w-full rounded-full object-cover" />
                                                    ) : (
                                                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium">{member.firstName} {member.lastName}</div>
                                                    <div className="text-xs text-muted-foreground">{member.email}</div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-sm text-muted-foreground italic px-2">No members assigned</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
