import { Module } from '@nestjs/common';
import { XmlToCsvModule } from './xml-to-csv/xml-to-csv.module';
import { FtpConnectModule } from './ftp-connect/ftp-connect.module';

@Module({
  imports: [XmlToCsvModule, FtpConnectModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
