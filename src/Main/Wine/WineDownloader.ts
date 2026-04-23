
import { WineVersion } from '../../Common/Types/Wine';
import { PREDEFINED_WINE_VERSIONS } from '../../Common/Constant/WineCatalog';
import { IPC_CHANNELS, InstallRequest } from '../../Common/Types/IPC';
import { BrowserWindow } from 'electron/main';
import { get } from 'node:http';




/**
 * 내부 와인 카탈로그 
 * @returns 
 */
export function getWineCatalog(): WineVersion[] {

    const githubCatalog = getWineCatalogFromGithub();
    const userCatalog = getWineCatalogFromUser('path/to/user/config.json');
    return [...PREDEFINED_WINE_VERSIONS, ...githubCatalog, ...userCatalog];
}


function getWineCatalogFromUser(configPath: string): WineVersion[] {
    return [];
}



/**
 * Github Gist or Repo의 wine catalog를 가져오는 함수
 * @returns 
 */
function getWineCatalogFromGithub() {

    

    return [];
}




export function downloadWineVersion(window: BrowserWindow, wine: WineVersion): Promise<void> {




    return new Promise((resolve, reject) => {
        // IPC를 통해 메인 프로세스에 설치 요청을 보냄
        resolve();


    });

}
