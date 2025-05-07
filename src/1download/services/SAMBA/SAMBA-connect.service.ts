import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { IFileDownloadService } from '../download.interface';
const SMB2 = require('smb2'); // Importing SMB2 library using CommonJS syntax

@Injectable()
export class ProxioConnectService implements IFileDownloadService {
  async downloadFile(): Promise<void> {
    const smbFilePath = 'integrace-eos-web/data.xml'; // Path within the share
    const filePath = path.join(process.cwd(), 'public', 'data.xml');

    const smb2Client = new SMB2({
      share: '\\\\SERVER-SMB02\\integrace-sw$', 
    });

    try {
      const fileContent = await new Promise<Buffer>((resolve, reject) => {
        smb2Client.readFile(smbFilePath, (err: NodeJS.ErrnoException | null, data: Buffer) => {
          if (err) reject(err);
          else resolve(data);
        });
      });

      fs.writeFileSync(filePath, fileContent);
    } catch (error) {
      console.error('Error downloading file:', error);
      throw new Error('Failed to download file');
    } finally {
      smb2Client.close();
    }
  }
}
