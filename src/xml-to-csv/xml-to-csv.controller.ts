import { Controller, Get } from '@nestjs/common';
import { XmlToCsvService } from './xml-to-csv.service';

@Controller('eospersons')
// @Controller('xml-to-csv')
export class XmlToCsvController {
  constructor(private readonly xmlToCsvService: XmlToCsvService) {}

  @Get()
  async convertXmlToCsv(): Promise<string> {
    await this.xmlToCsvService.convertXmlToCsv();
    return 'CSV file has been created.';
  }
}
