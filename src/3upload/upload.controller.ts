import { Controller, Get } from '@nestjs/common';
import { FtpConnectService } from './services/SFTP/sftp-connect.service';

@Controller('source')
export class FtpConnectController {
  constructor(private readonly uploadService: FtpConnectService) {}

  @Get('upload')
  async uploadFile() {
    await this.uploadService.connect();
    await this.uploadService.uploadFile();
    await this.uploadService.disconnect();
    return { message: 'File uploaded successfully' };
  }
}
