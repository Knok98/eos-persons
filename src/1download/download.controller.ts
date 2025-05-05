import { Controller, Get } from '@nestjs/common';
import { ProxioConnectService } from './services/SAMBA/SAMBA-connect.service';

@Controller('source')
export class FileDownloadController {
  constructor(private readonly fileDownloadService: ProxioConnectService) {}

  @Get('download')
  async downloadFile(): Promise<string> {
    await this.fileDownloadService.downloadFile();
    return 'File downloaded and saved as data.xml';
  }
}
