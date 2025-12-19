import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { XmlToCsvService } from './inqool_xml2csv/xml2csv.service';

@Injectable()
export class ConvertCronService {
  constructor(private readonly conversion: XmlToCsvService) {}

  @Cron('20 23 * * *')
  async handleCron() {
    await this.conversion.convert();
    
  }
}
