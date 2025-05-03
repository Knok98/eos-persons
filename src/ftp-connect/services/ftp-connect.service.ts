import { Injectable, Logger } from '@nestjs/common';
import * as ftp from 'basic-ftp';
import * as path from 'path';
import { IFtpConnectService } from './ftp-connect.interface';

@Injectable()
export class FtpConnectService implements IFtpConnectService {
  private client: ftp.Client;
  private readonly logger = new Logger(FtpConnectService.name);

  constructor() {
    this.client = new ftp.Client();
    this.client.ftp.verbose = true; // Enable verbose logging
  }

  async connect() {
    const host = process.env.FTP_HOST;
    const user = process.env.FTP_USER;
    const password = process.env.FTP_PASSWORD;
    const port = process.env.FTP_PORT || 21;

    try {
      await this.client.access({
        host,
        user,
        password,
        port: Number(port),
        secure: false,
      });
      this.logger.log('Connected to FTP server');
    } catch (error) {
      this.logger.error('Failed to connect to FTP server', error);
      throw error;
    }
  }

  async uploadFile() {
    const csvFilePath = path.join(process.cwd(), 'public', 'persons.csv');
    try {
      await this.client.uploadFrom(csvFilePath, 'persons.csv');
      this.logger.log('File uploaded successfully');
    } catch (error) {
      this.logger.error('Failed to upload file', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      this.client.close();
      this.logger.log('Disconnected from FTP server');
    } catch (error) {
      this.logger.error('Failed to disconnect from FTP server', error);
      throw error;
    }
  }

  async runTask() {
    try {
      await this.connect();
      await this.uploadFile();
    } catch (error) {
      this.logger.error('Error during FTP task', error);
      throw error;
    } finally {
      await this.disconnect();
      this.logger.log('FTP task completed');
    }
  }
}
