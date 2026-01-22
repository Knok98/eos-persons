import { Controller, Get } from '@nestjs/common';
import { FtpConnectService } from './services/FTP/ftp-connect.service';

@Controller('source')
export class FtpConnectController {
  constructor(private readonly uploadService: FtpConnectService) {}

  @Get('upload')
  async uploadFile() {
    await this.uploadService.runTask();
    return { message: 'File uploaded successfully' };
  }
}
