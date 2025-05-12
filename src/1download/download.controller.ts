import { Controller, Get } from '@nestjs/common';
import { SrvSMB02 } from './services/SAMBA/SAMBA-connect.service';

@Controller('source')
export class FileDownloadController {
  constructor(private readonly fileDownloadService: SrvSMB02) {}

  @Get('download')
  async downloadFile(): Promise<string> {
    await this.fileDownloadService.downloadFile();
    return 'File downloaded and saved as data.xml';
  }
}
