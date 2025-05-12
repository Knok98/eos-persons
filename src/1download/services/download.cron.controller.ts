import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
<<<<<<< HEAD
import { SrvSMB02 } from './SAMBA/SAMBA-connect.service';
=======
import { SambaService } from './smb/samba.service';
>>>>>>> 048817ee35ffa46c0e4d423dcf3ba6189f380a91

@Injectable()
export class FileDownloadCronService {
  constructor(private readonly fileDownloadService: SambaService) {}

  @Cron('15 23 * * *')
  async handleCron() {
    await this.fileDownloadService.downloadFile();
  }
}
