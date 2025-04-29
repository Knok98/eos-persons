import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { XmlToCsvService } from './xml-to-csv.service';

@Injectable()
export class FtpCronService {
  constructor(private readonly xmlToCsvService: XmlToCsvService) {}

  //@Cron('05 1 * * *') 
   @Cron('05 * * * *') // Runs every 10 minutes for testing purposes
  async handleCron() {
    await this.xmlToCsvService.convertXmlToCsv();
    
  }
}
