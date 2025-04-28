import { Test, TestingModule } from '@nestjs/testing';
import { FtpConnectService } from './SAMBA-connect.service';

describe('FtpConnectService', () => {
  let service: FtpConnectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FtpConnectService],
    }).compile();

    service = module.get<FtpConnectService>(FtpConnectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
