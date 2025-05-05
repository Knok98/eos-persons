import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ProxioConnectService } from './SAMBA/SAMBA-connect.service';

@Injectable()
export class FileDownloadCronService {
  constructor(private readonly fileDownloadService: ProxioConnectService) {}

  @Cron('15 23 * * *')
  async handleCron() {
    await this.fileDownloadService.downloadFile();
  }
}
