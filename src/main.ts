import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
require('dotenv').config()
async function bootstrap() {
  
console.log('PORT:', process.env.PORT);
  console.log('FTP_HOST:', process.env.FTP_HOST);
  console.log('FTP_USER:', process.env.FTP_USER);
  console.log('FTP_PASS:', process.env.FTP_PASS);

  const app = await NestFactory.create(AppModule);
  console.log('Environment Variables:',process.env.FTP_USER, process.env.FTP_HOST, process.env.FTP_PASSWORD, process.env.FTP_PORT );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
