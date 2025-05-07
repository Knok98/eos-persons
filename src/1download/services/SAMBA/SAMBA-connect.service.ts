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

    console.log('Initializing SMB2 client...');
    const smb2Client = new SMB2({
      share: '\\\\SERVER-SMB02\\integrace-sw$', // Network share
      // Omitting domain, username, and password since Coolify has access
      domain: '', // Ensure domain is set to an empty string if not needed
      username: '', // Ensure username is set to an empty string if not needed
      password: '', // Ensure password is set to an empty string if not needed
    });

    console.log('SMB2 client initialized. Attempting to read file from SMB share...');
    try {
      const fileContent = await new Promise((resolve, reject) => {
        smb2Client.readFile(smbFilePath, (err: NodeJS.ErrnoException | null, data: Buffer | undefined) => {
          if (err) {
            console.error('Error reading file from SMB share:', err);
            reject(err);
          } else {
            console.log('File read successfully from SMB share.');
            resolve(data as Buffer);
          }
        });
      });

      console.log('Writing file content to local file system...');
      fs.writeFileSync(filePath, fileContent as Buffer);
      console.log('File written successfully to', filePath);
    } catch (error) {
      console.error('Error downloading file:', error);
      throw new Error('Failed to download file');
    } finally {
      console.log('Closing SMB2 client...');
      smb2Client.close();
      console.log('SMB2 client closed.');
    }
  }
}
