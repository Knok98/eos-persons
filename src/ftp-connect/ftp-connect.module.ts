import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { FtpConnectController } from './ftp-connect.controller';
import { FtpConnectService } from './services/ftp-connect.service';
import { FtpCronService } from './services/ftp-connect.cron.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [FtpConnectController],
  providers: [FtpConnectService, FtpCronService],
})
export class FtpConnectModule {}
