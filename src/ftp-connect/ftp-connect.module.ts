import { Module } from '@nestjs/common';
import { FtpConnectController } from './ftp-connect.controller';

@Module({
  controllers: [FtpConnectController]
})
export class FtpConnectModule {}
