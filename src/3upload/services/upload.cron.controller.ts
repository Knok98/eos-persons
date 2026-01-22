import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { FtpConnectService } from './FTP/ftp-connect.service';

@Injectable()
export class UploadCronService {
  constructor(private readonly ftpConnectService: FtpConnectService) {}

 @Cron('25 23 * * *')
  async handleCron() {
    await this.ftpConnectService.runTask();
  }
}
