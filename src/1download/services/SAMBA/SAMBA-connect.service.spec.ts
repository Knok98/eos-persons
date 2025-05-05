import { Test, TestingModule } from '@nestjs/testing';
import { ProxioConnectService } from './SAMBA-connect.service';

describe('ProxioConnectService', () => {
  let service: ProxioConnectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProxioConnectService],
    }).compile();

    service = module.get<ProxioConnectService>(ProxioConnectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
