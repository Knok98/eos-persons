import { Test, TestingModule } from '@nestjs/testing';
import { SrvSMB02 } from './SAMBA-connect.service';

describe('SrvSMB02', () => {
  let service: SrvSMB02;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SrvSMB02],
    }).compile();

    service = module.get<SrvSMB02>(SrvSMB02);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
