import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { SambaService } from './smb/samba.service';


@Injectable()
export class FileDownloadCronService {
  constructor(private readonly fileDownloadService: SambaService) {}

  @Cron('15 2,14 * * *')
  async handleCron() {
    await this.fileDownloadService.downloadFile();
  }
}
