import { Test, TestingModule } from '@nestjs/testing';
import { FtpConnectController } from './proxio-connect.controller';

describe('FtpConnectController', () => {
  let controller: FtpConnectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FtpConnectController],
    }).compile();

    controller = module.get<FtpConnectController>(FtpConnectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
