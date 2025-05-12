import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { SambaService } from './smb/samba.service';


@Injectable()
export class FileDownloadCronService {
  constructor(private readonly fileDownloadService: SambaService) {}

  @Cron('15 23 * * *')
  async handleCron() {
    await this.fileDownloadService.downloadFile();
  }
}
