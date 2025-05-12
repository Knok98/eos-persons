import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SrvSMB02 } from './SAMBA/SAMBA-connect.service';

@Injectable()
export class FileDownloadCronService {
  constructor(private readonly fileDownloadService: SrvSMB02) {}

  @Cron('15 23 * * *')
  async handleCron() {
    await this.fileDownloadService.downloadFile();
  }
}
