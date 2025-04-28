import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { FtpConnectService } from './ftp-connect.service';

@Injectable()
export class FtpCronService {
  constructor(private readonly ftpConnectService: FtpConnectService) {}

  @Cron('10 1 * * *') // Runs every day at 01:10 AM
  // @Cron('*/10 * * * *') // Runs every 10 minutes for testing purposes
  async handleCron() {
    await this.ftpConnectService.connect();
    await this.ftpConnectService.uploadFile();
    await this.ftpConnectService.disconnect();
  }
}
