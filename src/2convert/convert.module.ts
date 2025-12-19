import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { XmlToCsvService } from './service/inqool_xml2csv/xml2csv.service';
import { ConvertController } from './convert.controller';
import { ConvertCronService } from './service/convert.cron.controller';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [XmlToCsvService,ConvertCronService],
  controllers: [ConvertController]
})
export class ConvertModule {}
