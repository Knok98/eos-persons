import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { promises as fsPromises } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class SrvSMB02 {
  private readonly nfsMountPoint = 'Z:'; // Drive letter for the mounted NFS share
  private readonly nfsServerPath = '\\\\SERVER-SMB02\\integrace-sw$\\integrace-eos-web';

  async downloadFile(): Promise<void> {
    const remoteFilePath = 'data.xml';
    const localFilePath = path.join(process.cwd(), 'public', 'data.xml');

    try {
      // Mount the NFS share (requires administrative privileges)
      await execAsync(`powershell.exe -Command "New-PSDrive -Name Z -PSProvider FileSystem -Root ${this.nfsServerPath} -Persist"`);

      // Copy the file
      await execAsync(`copy ${path.join(this.nfsMountPoint, remoteFilePath)} ${localFilePath}`);

      console.log('File downloaded successfully');
    } catch (error) {
      console.error('Error:', error);
      if (error instanceof Error) {
        throw new Error(`File download failed: ${error.message}`);
      } else {
        throw new Error('File download failed: Unknown error');
      }
    } finally {
      try {
        // Unmount the share
        await execAsync(`powershell.exe -Command "Remove-PSDrive -Name Z"`);
      } catch (unmountError) {
        console.error('Error unmounting:', unmountError);
      }
    }
  }
}
