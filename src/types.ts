export interface ChroniclerPlayers {
    data: ChroniclerPlayer[];
}

export interface ChroniclerTeams {
    data: ChroniclerTeam[];
}

export interface ChroniclerPlayer {
    id: string;
    data: BlaseballPlayer;
}

export interface BlaseballPlayer {
    name: string;

    buoyancy: number;
    divinity: number;
    martyrdom: number;
    moxie: number;
    musclitude: number;
    patheticism: number;
    thwackability: number;
    tragicness: number;

    coldness: number;
    overpowerment: number;
    ruthlessness: number;
    shakespearianism: number;
    suppression: number;
    unthwackability: number;
    totalFingers: number;

    baseThirst: number;
    continuation: number;
    groundFriction: number;
    indulgence: number;
    laserlikeness: number;

    anticapitalism: number;
    chasiness: number;
    omniscience: number;
    tenaciousness: number;
    watchfulness: number;

    pressurization?: number;
    cinnamon?: number;

    hittingRating: number;
    pitchingRating: number;
    baserunningRating: number;
    defenseRating: number;

    permAttr?: string[];
    seasAttr?: string[];
    weekAttr?: string[];
    gameAttr?: string[];
    itemAttr?: string[];

    deceased: boolean;
    soul: number;
    fate: number;
    peanutAllergy: boolean;
    eDensity: number;

    ritual: string;
}

export interface ChroniclerTeam {
    id: string;
    data: BlaseballTeam;
}

export interface BlaseballTeam {
    id: string;
    fullName: string;
    nickname: string;
    emoji: string;
    shorthand: string;

    lineup: string[];
    rotation: string[];
    bullpen: string[];
    bench: string[];

    stadium: string | null;
}

export interface PlayerTeamMapping {
    player: string;
    teamId: string;
    position: "lineup" | "rotation" | "bullpen" | "bench";
    index: number;
}

export type PlayerTeamMap = Record<string, PlayerTeamMapping[]>;

export interface PlayerMeta {
    id: string;
    modifiers: string[];
    teams: PlayerTeamMapping[];
    mainTeam: PlayerTeamMapping | null;
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
