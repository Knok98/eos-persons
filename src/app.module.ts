import { Module } from '@nestjs/common';
import { UploadModule } from './3upload/upload.module';
import { ConvertModule} from './2convert/convert.module';
import { FileDownloadModule } from './1download/download.module';

@Module({
  imports: [UploadModule, ConvertModule, FileDownloadModule],
})
export class AppModule {}
