import { BlaseballPlayer, BlaseballTeam } from "./api/types";

export type TeamPosition = "lineup" | "rotation" | "shadows";

export interface RosterEntry {
    player: string;
    teamId: string;
    position: TeamPosition;
    index: number;
}

export interface PlayerMeta {
    id: string;
    modifiers: string[];
    teams: RosterEntry[];
    mainTeam: RosterEntry | null;
    mainTeamData: BlaseballTeam | null;
    player: BlaseballPlayer;
}

export interface PlayerMod {
    id: string;
    color: string;
    textColor: string;
    background: string;
    title: string;
    description: string;
}
