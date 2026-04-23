import { WineVersion } from '../Types/Wine';


const OfficialWineVersions: WineVersion[] = [
    {
        id: 'wine-9.0-stable',
        name: 'Wine 9.0 Stable',
        version: '9.0',
        status: 'available',
        progress: 0
    },
    {
        id: 'wine-8.0-stable',
        name: 'Wine 8.0 Stable',
    }]





export const PREDEFINED_WINE_VERSIONS: WineVersion[] = [
    {
        id: 'wine-9.0-stable',
        name: 'Wine 9.0 Stable',
        version: '9.0',
        downloadUrl: '', // 실제 다운로드 주소
        type: 'official',
        status: 'available',
        progress: 0
    },
    {
        id: 'ge-proton-latest',
        name: 'GE-Proton (Latest)',
        version: '8-25',
        downloadUrl: 'https://github.com/...',
        type: 'custom',
        status: 'available',
        progress: 0
    }
];