
import { Injectable, Logger } from '@nestjs/common';
import * as ftp from 'basic-ftp';
import * as path from 'path';
import { UploadService } from '../upload.interface';

@Injectable()
export class FtpConnectService implements UploadService {
  private readonly logger = new Logger(FtpConnectService.name);

  
  async runTask(): Promise<void> {
    const client = new ftp.Client();
    client.ftp.verbose = true;         
    client.ftp.timeout = 30000;        

    const host = process.env.FTP_HOST!;
    const user = process.env.FTP_USER!;
    const password = process.env.FTP_PASSWORD!;
    const port = Number(process.env.FTP_PORT ?? 21);

    const localCsv = path.join(process.cwd(), 'public', 'persons.csv');
    const remoteCsv = 'persons.csv';

    try {
      await client.access({
        host,
        user,
        password,
        port,
        secure: false,                 
      });
      this.logger.log('Connected to FTP server');

      
      await client.uploadFrom(localCsv, remoteCsv);
      this.logger.log('File uploaded successfully');
    } catch (err: any) {
      this.logger.error(`FTP task failed: ${err?.message ?? err}`, err?.stack);
      throw err;
    } finally {
      
      client.close();
      this.logger.log('Disconnected from FTP server / client closed');
    }
  }
}
``
