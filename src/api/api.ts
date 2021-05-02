import { getAllModIds, Player, RosterEntry } from "../models/Player";
import { generatePlayerTeamMap } from "../utils";
import {
    BlaseballPlayer,
    BlaseballTeam,
    ChroniclerEntities,
    PlayerMod,
} from "./types";
import queryString from "query-string";

export interface LeagueData {
    players: Record<string, Player>;
    teams: Record<string, BlaseballTeam>;
    roster: Record<string, RosterEntry[]>;
    mods: Record<string, PlayerMod>;
}

export async function fetchLeagueData(at: string | null): Promise<LeagueData> {
    const [[players, mods], teams] = await Promise.all([
        fetchPlayersAndMods(at),
        fetchTeams(at),
    ]);

    const teamMap = Object.fromEntries(
        teams.items.map((t) => [t.entityId, t.data])
    );
    const rosterMap = generatePlayerTeamMap(teams.items);
    const modMap = Object.fromEntries(mods.map((m) => [m.id, m]));
    const playerObjects = Object.fromEntries(
        players.items.map((p) => [
            p.entityId,
            new Player(p, teamMap, rosterMap),
        ])
    );

    return {
        players: playerObjects,
        teams: teamMap,
        roster: rosterMap,
        mods: modMap,
    };
}

async function fetchPlayersAndMods(
    at: string | null
): Promise<[ChroniclerEntities<BlaseballPlayer>, PlayerMod[]]> {
    const players = await fetchJson<ChroniclerEntities<BlaseballPlayer>>(
        queryString.stringifyUrl({
            url: "https://api.sibr.dev/chronicler/v2/entities",
            query: { type: "player", at: at ?? undefined },
        })
    );
    const modIds = getAllModIds(players.items);
    const mods = await fetchJson<PlayerMod[]>(
        "https://api.sibr.dev/proxy/database/mods?ids=" + modIds.join(",")
    );
    return [players, mods];
}

async function fetchTeams(
    at: string | null
): Promise<ChroniclerEntities<BlaseballTeam>> {
    return await fetchJson<ChroniclerEntities<BlaseballTeam>>(
        queryString.stringifyUrl({
            url: "https://api.sibr.dev/chronicler/v2/entities",
            query: { type: "team", at: at ?? undefined },
        })
    );
}

async function fetchJson<T>(url: string): Promise<T> {
    const resp = await fetch(url, {
        mode: "cors",
    });
    return (await resp.json()) as T;
}
