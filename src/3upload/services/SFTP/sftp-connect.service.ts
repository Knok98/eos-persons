
import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import { UploadService } from '../upload.interface';

// CommonJS import – bez potřeby esModuleInterop
const SftpClient = require('ssh2-sftp-client');

@Injectable()
export class FtpConnectService implements UploadService {
  private client: InstanceType<typeof SftpClient>;
  private readonly logger = new Logger(FtpConnectService.name);

  constructor() {
    this.client = new SftpClient();
  }

  async connect() {
    const host = process.env.FTP_HOST;
    const username = process.env.FTP_USER;            // ponecháno
    const password = process.env.FTP_PASSWORD;            // POZOR: dle tvé konfigurace
    const port = Number(process.env.FTP_PORT || 22);  // SFTP default: 22

    if (!host || !username || !password) {
      throw new Error('Missing SFTP ENV (FTP_HOST / FTP_USER / FTP_PASS)');
    }

    try {
      await this.client.connect({
        host,
        port,
        username,
        password,
        readyTimeout: 20000,
      });
      this.logger.log('Connected to SFTP server');
    } catch (error) {
      this.logger.error('Failed to connect to SFTP server', error as Error);
      throw error;
    }
  }

  async uploadFile() {
    const localCsvPath = path.join(process.cwd(), 'public', 'persons.csv');

    // REMOTE cesty na SFTP jsou POSIX (doporučujeme path.posix)
    const remoteCsvPath = '/data/contacts/personsFinal.csv';
    const remoteDir = path.posix.dirname(remoteCsvPath);

    try {
      const exists = await this.client.exists(remoteDir); // false | 'd' | '-'
      if (!exists) {
        await this.client.mkdir(remoteDir, true); // recursive
        this.logger.log(`Created remote directory: ${remoteDir}`);
      }

      await this.client.fastPut(localCsvPath, remoteCsvPath);
      this.logger.log('File uploaded successfully via SFTP');
    } catch (error) {
      this.logger.error('Failed to upload file via SFTP', error as Error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.client.end(); // korektní ukončení SFTP session
      this.logger.log('Disconnected from SFTP server');
    } catch (error) {
      this.logger.error('Failed to disconnect from SFTP server', error as Error);
      throw error;
    }
  }

  async runTask() {
    try {
      await this.connect();
      await this.uploadFile();
    } catch (error) {
      this.logger.error('Error during SFTP task', error as Error);
      throw error;
    } finally {
      await this.disconnect();
      this.logger.log('SFTP task completed');
    }
  }
}