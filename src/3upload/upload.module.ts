import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { FtpConnectController } from './upload.controller';
import { FtpConnectService } from './services/FTP/ftp-connect.service';
import { UploadCronService } from './services/upload.cron.controller';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [FtpConnectController],
  providers: [FtpConnectService, UploadCronService],
})
export class UploadModule {}
