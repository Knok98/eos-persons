import { Controller, Get } from '@nestjs/common';
import { XmlToCsvService } from './service/xml-to-csv.service';

@Controller('xml2csv')
// @Controller('xml-to-csv')
export class XmlToCsvController {
  constructor(private readonly xmlToCsvService: XmlToCsvService) {}

  @Get()
  async convertXmlToCsv(): Promise<string> {
    await this.xmlToCsvService.convertXmlToCsv();
    return 'CSV file has been created.';
  }
}
