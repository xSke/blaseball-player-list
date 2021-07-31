import { BlaseballTeam } from "./api/types";

export type TeamType =
    | "league"
    | "coffee"
    | "special"
    | "library"
    | "deprecated";

export const ilbTeamIds = [
    "105bc3ff-1320-4e37-8ef0-8d595cb95dd0",
    "23e4cbc1-e9cd-47fa-a35b-bfa06f726cb7",
    "36569151-a2fb-43c1-9df7-2df512424c82",
    "3f8bbb15-61c0-4e3f-8e4a-907a5fb1565e",
    "46358869-dce9-4a01-bfba-ac24fc56f57e",
    "57ec08cc-0411-4643-b304-0e80dbc15ac7",
    "747b8e4a-7e50-4638-a973-ea7950a3e739",
    "7966eb04-efcc-499b-8f03-d13916330531",
    "878c1bf6-0d21-4659-bfee-916c8314d69c",
    "8d87c468-699a-47a8-b40d-cfb73a5660ad",
    "979aee4a-6d80-4863-bf1c-ee1a78e06024",
    "9debc64f-74b7-4ae1-a4d6-fce0144b6ea5",
    "a37f9158-7f82-46bc-908c-c9e2dda7c33b",
    "adc5b394-8f76-416d-9ce9-813706877b84",
    "b024e975-1c4a-4575-8936-a3754a08806a",
    "b63be8c2-576a-4d6e-8daf-814f8bcea96f",
    "b72f3061-f573-40d7-832a-5ad475bd7909",
    "bb4a9de5-c924-4923-a0cb-9d1445f1ee5d",
    "bfd38797-8404-4b38-8b82-341da28b1f83",
    "c73b705c-40ad-4633-a6ed-d357ee2e2bcf",
    "ca3f1c8c-c025-4d8e-8eef-5be6accbeb16",
    "d9f89a8a-c563-493e-9d64-78e4f9a55d4a",
    "eb67ae5e-c4bf-46ca-bbbc-425cd34182ff",
    "f02aeae2-5e6a-4098-9842-02d2273f25c7",
];

export const coffeeTeamIds = [
    "49181b72-7f1c-4f1c-929f-928d763ad7fb",
    "4d921519-410b-41e2-882e-9726a4e54a6a",
    "4e5d0063-73b4-440a-b2d1-214a7345cf16",
    "70eab4ab-6cb1-41e7-ac8b-1050ee12eecc",
    "9a5ab308-41f2-4889-a3c3-733b9aab806e",
    "9e42c12a-7561-42a2-b2d0-7cf81a817a5e",
    "a3ea6358-ce03-4f23-85f9-deb38cb81b20",
    "a7592bd7-1d3c-4ffb-8b3a-0b1e4bc321fd",
    "b3b9636a-f88a-47dc-a91d-86ecc79f9934",
    "d8f82163-2e74-496b-8e4b-2ab35b2d3ff1",
    "e3f90fa1-0bbe-40df-88ce-578d0723a23b",
    "e8f7ffee-ec53-4fe0-8e87-ea8ff1d0b4a9",
    "f29d6e60-8fce-4ac6-8bc2-b5e3cabc5696",
];

export const specialTeamIds = [
    "698cfc6d-e95e-4391-b754-b87337e4d2a9", // Vault Legends
    "280c587b-e8f6-4a7e-a8ce-fd2fa2fa3e70", // Rising Stars
    "d2634113-b650-47b9-ad95-673f8e28e687", // Data Witches
    "3b0a289b-aebd-493c-bc11-96793e7216d5", // Artists
    "7fcb63bc-11f2-40b9-b465-f1d458692a63", // Game Band
    "c6c01051-cdd4-47d6-8a98-bb5b754f937f", // Hall Stars
    "40b9ec2a-cb43-4dbb-b836-5accb62e7c20", // PODS
];

export const libraryTeamIds = [
    "88151292-6c12-4fb8-b2d6-3e64821293b3", // Alaskan Immortals
    "54d0d0f2-16e0-42a0-9fff-79cfa7c4a157", // Antarctic Fireballs
    "9494152b-99f6-4adb-9573-f9e084bc813f", // Baltimore Crabs (alt)
    "cfd20759-5f9c-4596-9493-2669b6daf396", // Beijing Bicycles
    "939db13f-79c9-41c5-9a15-b340b1bea875", // Boulders Bay Birds
    "67c0a873-ef6d-4a85-8293-af638edf3c9f", // Busan Bison
    "d6a352fc-b675-40a0-864d-f4fd50aaeea0", // Canada Artists
    "ed60c164-fd31-42ff-8ae1-70220626f5a7", // Canberra Drop Bears
    "2e22beba-8e36-42ba-a8bf-975683c52b5f", // Carolina Queens
    "55c9fee3-79c8-4467-8dfb-ff1e340aae8c", // Dallas Cows
    "71c621eb-85dc-4bd7-a690-0c68c0e6fb90", // Downward Dogs
    "74966fbd-5d77-48b1-8075-9bf197583775", // Florence Rhinoceroses
    "4c192065-65d8-4010-8145-395f82d24ddf", // Green Hill Hedgehogs
    "b6b5df8f-5602-4883-b47d-07e77ed9d5af", // Laredo Excavators
    "00245773-6f25-43b1-a863-42b4068888f0", // La Paz Llamas
    "26f947db-4e2a-41a5-896c-02cf8eb47af0", // Lisbon Lynx
    "7bc12507-1a84-4921-9338-c1888d56dcd7", // London Frogs
    "1e04e5cc-80a6-41c0-af0d-7292817eed79", // Louisville Lobsters
    "d0762a7e-004b-48a9-a832-a993982b305b", // Mallorca Whales
    "3a094991-4cbc-4786-b74c-688876d243f4", // Maryland Squirrels
    "c19bb50b-9a22-4dd2-8200-bce639b1b239", // Minneapolis Truckers
    "53d473fb-ffee-4fd3-aa1c-671228adc592", // New Hampshire Eggplants
    "cbd44c06-231a-4d1a-bb7d-4170b06e566a", // Oklahoma Heartthrobs
    "1a51664e-efec-45fa-b0ba-06d04c344628", // Oregon Psychics
    "8e50d878-3dcd-4c27-9f1c-8d8f20f17077", // Portland Otters
    "258f6389-aac1-43d2-b30a-4b4dde90d5eb", // Kola Boar
    "a4b23784-0132-4813-b300-f7449cb06493", // Phoenix Trunks
    "774762ee-c234-4c57-90a1-e1e69db3f6a7", // Sao Paulo Parrots
    "4cd14d96-f817-41a3-af6c-2d3ed0dd20b7", // San Diego Saltines
    "3543229a-668c-4ac9-b64a-588422481f12", // Wyoming Dolphins
];

export function sortTeams(teams: BlaseballTeam[]): BlaseballTeam[] {
    return [...teams].sort((a, b) => {
        const aName = getTeamName(a);
        const bName = getTeamName(b);
        return aName.nickname.localeCompare(bName.nickname);
    });
}

export function getTeamName(team: BlaseballTeam): {
    location: string;
    nickname: string;
    fullName: string;
} {
    if (team?.state?.scattered) {
        return {
            location: team.state.scattered.location,
            nickname: team.state.scattered.nickname,
            fullName: team.state.scattered.fullName,
        };
    }

    return {
        location: team.location,
        nickname: team.nickname,
        fullName: team.fullName,
    };
}

export function getTeamType(teamId: string): TeamType | null {
    // PODS is deprecated but still in the special list so
    if (teamId == "40b9ec2a-cb43-4dbb-b836-5accb62e7c20") return "deprecated";

    if (ilbTeamIds.includes(teamId)) return "league";
    if (coffeeTeamIds.includes(teamId)) return "coffee";
    if (specialTeamIds.includes(teamId)) return "special";
    if (libraryTeamIds.includes(teamId)) return "library";
    return null;
}
