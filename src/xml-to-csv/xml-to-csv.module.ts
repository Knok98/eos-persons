import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { XmlToCsvService } from './service/xml-to-csv.service';
import { XmlToCsvController } from './xml-to-csv.controller';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [XmlToCsvService],
  controllers: [XmlToCsvController]
})
export class XmlToCsvModule {}
