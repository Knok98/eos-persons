import { Controller, Get } from '@nestjs/common';

import { SambaService } from './services/smb/samba.service';

@Controller('source')
export class FileDownloadController {
  constructor(private readonly fileDownloadService: SambaService) {}

  @Get('download')
  async downloadFile(): Promise<string> {
    await this.fileDownloadService.downloadFile();
    return 'File downloaded and saved as data.xml';
  }
}
