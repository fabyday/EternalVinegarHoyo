import { WineVersion } from "../Types/Wine";

export const OFFICIAL_WINE_VERSIONS: WineVersion[] = [
  {
    id: "wine-9.0-stable",
    name: "Wine 9.0 Stable",
    version: "9.0",
    downloadUrl: "",
    type: "official",
    status: "available",
    progress: 0,
  },
  {
    id: "wine-8.0-stable",
    name: "Wine 8.0 Stable",
    version: "8.0",
    downloadUrl: "",
    type: "official",
    status: "available",
    progress: 0,
  },
];

export const PREDEFINED_WINE_VERSIONS: WineVersion[] = [
  ...OFFICIAL_WINE_VERSIONS,
  {
    id: "ge-proton-latest",
    name: "GE-Proton Latest",
    version: "8-25",
    downloadUrl: "https://github.com/GloriousEggroll/proton-ge-custom/releases",
    type: "custom",
    status: "available",
    progress: 0,
  },
];
