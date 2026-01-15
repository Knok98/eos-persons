
import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import { UploadService } from '../upload.interface';


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
    const username = process.env.FTP_USER;            
    const password = process.env.FTP_PASSWORD;            
    const port = Number(process.env.FTP_PORT || 22);  

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

  const remoteCsvPath = '/data/contacts/personsFinal.csv';
  const remoteDir = path.posix.dirname(remoteCsvPath);

  try {
  
    const dirExists = await this.client.exists(remoteDir);
    if (!dirExists) {
      await this.client.mkdir(remoteDir, true);
      this.logger.log(`Created remote directory: ${remoteDir}`);
    }


    const fileExists = await this.client.exists(remoteCsvPath);
    if (fileExists) {
      await this.client.delete(remoteCsvPath);
      this.logger.log(`Deleted old file: ${remoteCsvPath}`);
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
      await this.client.end(); 
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
