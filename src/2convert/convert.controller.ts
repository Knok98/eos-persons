import { Controller, Get } from '@nestjs/common';
import { XmlToCsvService } from './service/xml2csv/xml2csv.service';

@Controller('source')
// @Controller('xml-to-csv')
export class ConvertController {
  constructor(private readonly xmlToCsvService: XmlToCsvService) {}

  @Get('convert')
  async convertXmlToCsv(): Promise<string> {
    await this.xmlToCsvService.convert();
    return 'File has been converted';}
}
