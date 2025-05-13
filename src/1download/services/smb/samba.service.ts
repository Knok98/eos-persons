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
            address: '\\\\SERVER-SMB02\\integrace-eos\\',
            domain: 'praha10.local',
            username: 'integrace.web',
            password: '>QxY5Y$£6£38v^0.',
        });
    }

    async downloadFile(): Promise<void> {
        const fileName = "data.xml";
        const destinationPath = path.join(process.cwd(), 'public', "downloaded.xml");

        const fileContent = await this.sambaClient.getFile(fileName, destinationPath);
    }
}