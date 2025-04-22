import { Test, TestingModule } from '@nestjs/testing';
import { XmlToCsvController } from './xml-to-csv.controller';

describe('XmlToCsvController', () => {
  let controller: XmlToCsvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [XmlToCsvController],
    }).compile();

    controller = module.get<XmlToCsvController>(XmlToCsvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
