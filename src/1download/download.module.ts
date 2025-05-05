import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { FileDownloadController } from './download.controller';
import { ProxioConnectService } from './services/SAMBA/SAMBA-connect.service';
import { FileDownloadCronService } from './services/download.cron.controller';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [FileDownloadController],
  providers: [FileDownloadCronService, ProxioConnectService],
})
export class FileDownloadModule {}
