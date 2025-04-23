import { Module } from '@nestjs/common';
import { FtpConnectController } from './ftp-connect.controller';
import { FtpConnectService } from './ftp-connect.service';

@Module({
  providers: [FtpConnectService],
  controllers: [FtpConnectController]
})
export class FtpConnectModule {}
