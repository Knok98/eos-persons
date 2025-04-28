import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { FtpConnectController } from './proxio-connect.controller';
import { FtpConnectService } from './services/SAMBA-connect.service';
import { FtpCronService } from './services/proxio-connect.cron.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [FtpConnectController],
  providers: [FtpConnectService, FtpCronService],
})
export class FtpConnectModule {}
