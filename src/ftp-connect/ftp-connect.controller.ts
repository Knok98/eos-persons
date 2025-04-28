import { Controller, Get } from '@nestjs/common';
import { FtpConnectService } from './services/ftp-connect.service';

@Controller('ftpc')
export class FtpConnectController {
  constructor(private readonly ftpConnectService: FtpConnectService) {}

  @Get('upload')
  async uploadFile() {
    await this.ftpConnectService.connect();
    await this.ftpConnectService.uploadFile();
    await this.ftpConnectService.disconnect();
    return { message: 'File uploaded successfully' };
  }
}
