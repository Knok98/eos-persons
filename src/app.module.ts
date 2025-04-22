import { Module } from '@nestjs/common';
import { XmlToCsvModule } from './xml-to-csv/xml-to-csv.module';
import { FtpConnectService } from './ftp-connect/ftp-connect.service';
import { FtpConnectModule } from './ftp-connect/ftp-connect.module';

@Module({
  imports: [XmlToCsvModule, FtpConnectModule],
  controllers: [],
  providers: [FtpConnectService],
})
export class AppModule {}
