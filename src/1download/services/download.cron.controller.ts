import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { SambaService } from './smb/samba.service';


@Injectable()
export class FileDownloadCronService {
  constructor(private readonly fileDownloadService: SambaService) {}

  @Cron('50 1,13 * * *')
  async handleCron() {
    await this.fileDownloadService.downloadFile();
    console.log("cron operation - download done");
  }
}
