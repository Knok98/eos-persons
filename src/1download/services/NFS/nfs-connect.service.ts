import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { promises as fsPromises } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class ProxioConnectService {
  private readonly nfsMountPoint = '/mnt/integrace_eos_web';
  private readonly nfsServerPath = 'SERVER-SMB02:/integrace-eos-web';

  async downloadFile(): Promise<void> {
    const remoteFilePath = 'data.xml';
    const localFilePath = path.join(process.cwd(), 'public', 'data.xml');

    try {
      // Create mount point if it doesn't exist
      await fsPromises.mkdir(this.nfsMountPoint, { recursive: true });

      // Mount the NFS share (requires root privileges)
      await execAsync(`sudo mount -t nfs ${this.nfsServerPath} ${this.nfsMountPoint}`);

      // Copy the file
      await execAsync(`cp ${path.join(this.nfsMountPoint, remoteFilePath)} ${localFilePath}`);

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
        await execAsync(`sudo umount ${this.nfsMountPoint}`);
      } catch (unmountError) {
        console.error('Error unmounting:', unmountError);
      }
    }
  }
}