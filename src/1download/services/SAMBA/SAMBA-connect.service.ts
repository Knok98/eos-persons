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

    const response = await axios({
      url: externalServerPath,
      method: 'GET',
      responseType: 'stream',
    });

    response.data.pipe(fs.createWriteStream(filePath));

    return new Promise((resolve, reject) => {
      response.data.on('end', () => {
        resolve();
      });

      response.data.on('error', (err: Error) => {
        reject(err);
      });
    });
  }
}
