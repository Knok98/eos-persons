import { Module } from '@nestjs/common';
import { FtpConnectModule } from './ftp-connect/ftp-connect.module';
import { XmlToCsvModule } from './xml-to-csv/xml-to-csv.module';

@Module({
  imports: [FtpConnectModule, XmlToCsvModule],
})
export class AppModule {}
