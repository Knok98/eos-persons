
import { Injectable, Logger } from '@nestjs/common';
import * as ftp from 'basic-ftp';
import * as path from 'path';
import { UploadService } from '../upload.interface';

@Injectable()
export class FtpConnectService implements UploadService {
  private readonly logger = new Logger(FtpConnectService.name);

  async runTask() {
    // NOVÁ instance klienta pro každý běh (žádné sdílení mezi CRONy)
    const client = new ftp.Client();
    client.ftp.verbose = true;

    const host = process.env.FTP_HOST;
    const user = process.env.FTP_USER;
    const password = process.env.FTP_PASSWORD;
    const port = Number(process.env.FTP_PORT || 21);

    const csvFilePath = path.join(process.cwd(), 'public', 'persons.csv');

    try {

      await client.access({
        host,
        user,
        password,
        port,
        secure: false,
      });
      this.logger.log('Connected to FTP server');

  
      await client.uploadFrom(csvFilePath, 'persons.csv');
      this.logger.log('File uploaded successfully');

    } catch (error) {
      this.logger.error('Error during FTP task', error);
      throw error;

    } finally {
    
      client.close();
      this.logger.log('Disconnected from FTP server');
      this.logger.log('FTP task completed');
    }
  }
}
