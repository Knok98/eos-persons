import { Module } from '@nestjs/common';
import { XmlToCsvService } from './xml-to-csv.service';
import { XmlToCsvController } from './xml-to-csv.controller';

@Module({
  providers: [XmlToCsvService],
  controllers: [XmlToCsvController]
})
export class XmlToCsvModule {}
