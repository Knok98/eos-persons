import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { IFileDownloadService } from '../download.interface';

@Injectable()
export class ProxioConnectService implements IFileDownloadService {
  async downloadFile(): Promise<void> {
    const externalServerPath = process.env.SOURCE_DIR;
    const filePath = path.join(process.cwd(), 'public', 'data.xml');

    try {
      const response = await axios({
        url: externalServerPath,
        method: 'GET',
        responseType: 'stream',
      });

      const writer = fs.createWriteStream(filePath);

      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      throw new Error('Failed to download file');
    }
  }
}
