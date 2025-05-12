import { Controller, Get } from '@nestjs/common';
<<<<<<< HEAD
import { SrvSMB02 } from './services/SAMBA/SAMBA-connect.service';
=======
import { SambaService } from './services/smb/samba.service';
>>>>>>> 048817ee35ffa46c0e4d423dcf3ba6189f380a91

@Controller('source')
export class FileDownloadController {
  constructor(private readonly fileDownloadService: SambaService) {}

  @Get('download')
  async downloadFile(): Promise<string> {
    await this.fileDownloadService.downloadFile();
    return 'File downloaded and saved as data.xml';
  }
}
