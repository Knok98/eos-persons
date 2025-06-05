import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { IFileDownloadService } from '../download.interface';
const SambaClient = require('samba-client');

@Injectable()
export class SambaService implements IFileDownloadService {
    private readonly sambaClient: typeof SambaClient;
    private readonly logger = new Logger(SambaService.name);

    constructor() {
        this.sambaClient = new SambaClient({
            address: '//server-smb02.praha10.local/integrace-eos',
            domain: 'PRAHA10.local',
            username: 'praha10/web.integrace',
            password: '1+qzRZy8en9,{il+',
        });
        this.logger.log('Samba client initialized');
    }

    async downloadFile(): Promise<void> {
        const fileName = "data.xml";
        const destinationPath = path.join(process.cwd(), 'public', fileName);

        this.logger.log(`Starting download of ${fileName} to ${destinationPath}`);

        try {
            await this.sambaClient.getFile(fileName, destinationPath);
            this.logger.log(`Successfully downloaded ${fileName}`);
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Failed to download ${fileName}`, error.stack);
            } else {
                this.logger.error(`Failed to download ${fileName}: ${JSON.stringify(error)}`);
            }
        }
    }
}
