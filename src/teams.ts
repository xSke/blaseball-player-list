import { BlaseballTeam } from "./api/types";

export type TeamType = "league" | "coffee" | "special" | "ulb" | "deprecated";

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
    "d2634113-b650-47b9-ad95-673f8e28e687", // Data Witches
    "3b0a289b-aebd-493c-bc11-96793e7216d5", // Artists
    "7fcb63bc-11f2-40b9-b465-f1d458692a63", // Game Band
    "c6c01051-cdd4-47d6-8a98-bb5b754f937f", // Hall Stars
    "40b9ec2a-cb43-4dbb-b836-5accb62e7c20", // PODS
];

export const ulbTeamIds = [
    "88151292-6c12-4fb8-b2d6-3e64821293b3", // Alaskan Immortals
];

export function sortTeams(teams: BlaseballTeam[]): BlaseballTeam[] {
    return [...teams].sort((a, b) => {
        return a.nickname.localeCompare(b.nickname);
    });
}

export function getTeamType(teamId: string): TeamType | null {
    // PODS is deprecated but still in the special list so
    if (teamId == "40b9ec2a-cb43-4dbb-b836-5accb62e7c20") return "deprecated";

    if (ilbTeamIds.includes(teamId)) return "league";
    if (coffeeTeamIds.includes(teamId)) return "coffee";
    if (specialTeamIds.includes(teamId)) return "special";
    if (ulbTeamIds.includes(teamId)) return "ulb";
    return null;
}
