import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { FtpConnectService } from './SFTP/sftp-connect.service';

@Injectable()
export class UploadCronService {
  constructor(private readonly ftpConnectService: FtpConnectService) {}

 @Cron('5 3,15 * * *')
  async handleCron() {
    await this.ftpConnectService.connect();
    await this.ftpConnectService.uploadFile();
    await this.ftpConnectService.disconnect();
    console.log("cron operation - upload done");
  }
}
