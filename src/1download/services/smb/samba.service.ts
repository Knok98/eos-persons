import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { IFileDownloadService } from '../download.interface';
const SambaClient = require('samba-client');

// Je potřeba nainstalovat smbclient na linux
// sudo apt install smbclient
@Injectable()
export class SambaService implements IFileDownloadService {
    private readonly sambaClient: typeof SambaClient;

    constructor() {
        this.sambaClient = new SambaClient({
            address: '//server-smb02.praha10.local/integrace-eos',
            domain: 'PRAHA10.local',
            username: 'praha10/web.integrace',
            password: '1+qzRZy8en9,{il+',
        });
    }
    // smbclient //server-smb02.praha10.local/integrace-eos -U praha10/web.integrace --password 1+qzRZy8en9,{il+ -c "get data.xml /app/public/data.xml"

    async downloadFile(): Promise<void> {
        const fileName = "data.xml";
        const destinationPath = path.join(process.cwd(), 'public', "data.xml");

        const fileContent = await this.sambaClient.getFile(fileName, destinationPath);
    }
}