import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { FileDownloadController } from './download.controller';
<<<<<<< HEAD
import { SrvSMB02 } from './services/SAMBA/SAMBA-connect.service';
=======
import { SambaService } from './services/smb/samba.service';
>>>>>>> 048817ee35ffa46c0e4d423dcf3ba6189f380a91
import { FileDownloadCronService } from './services/download.cron.controller';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [FileDownloadController],
  providers: [FileDownloadCronService, SambaService],
})
export class FileDownloadModule {}
