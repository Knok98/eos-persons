import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { FileDownloadController } from './download.controller';

import { SambaService } from './services/smb/samba.service';
import { FileDownloadCronService } from './services/download.cron.controller';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [FileDownloadController],
  providers: [FileDownloadCronService, SambaService],
})
export class FileDownloadModule {}
