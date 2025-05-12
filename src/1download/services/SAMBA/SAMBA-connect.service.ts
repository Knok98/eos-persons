import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { IFileDownloadService } from '../download.interface';
const SMB2 = require('smb2');

@Injectable()
export class SrvSMB02 implements IFileDownloadService {
  async downloadFile(): Promise<void> {
    const smbFilePath = 'integrace-eos-web/data.xml';
    const filePath = path.join(process.cwd(), 'public', 'data.xml');

    console.log('Initializing SMB2 client...');
    const smb2Client = new SMB2({
      share: '\\\\SERVER-SMB02\\integrace-sw$',
      domain: process.env.SMB_DOMAIN || '',
      username: process.env.SMB_USER || '',
      password: process.env.SMB_PASSWORD || '',
    });

    // Better logging of the configuration
    console.log('SMB2 Client Configuration:', {
      share: smb2Client.share,
      domain: smb2Client.domain,
      username: smb2Client.username ? '*****' : 'empty',
      fullPath: `\\\\${smb2Client.server}\\${smb2Client.share}\\${smbFilePath}`
    });

    console.log('Attempting to read file from SMB share...');
    try {
      const fileContent = await new Promise<Buffer>((resolve, reject) => {
        smb2Client.readFile(smbFilePath, (err: Error | null, data: Buffer) => {
          if (err) {
            console.error('Detailed SMB error:', {
              message: err.message,
              stack: err.stack,
              smbStatus: (err as any).smbStatus
            });
            reject(err);
          } else {
            console.log('File read successfully from SMB share. Size:', data.length, 'bytes');
            resolve(data);
          }
        });
      });

      console.log('Writing file content to local file system...');
      fs.writeFileSync(filePath, fileContent);
      console.log(`File successfully written to ${filePath}`);
    } catch (error) {
      console.error('Error in downloadFile:', {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined
      });
      throw new Error(`Failed to download file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      console.log('Closing SMB2 client...');
      smb2Client.close();
      console.log('SMB2 client closed.');
    }
  }
}