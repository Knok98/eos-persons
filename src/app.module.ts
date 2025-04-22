import { Module } from '@nestjs/common';
import { XmlToCsvModule } from './xml-to-csv/xml-to-csv.module';

@Module({
  imports: [XmlToCsvModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
