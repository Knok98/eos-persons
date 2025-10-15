import { Test, TestingModule } from '@nestjs/testing';
import { XmlToCsvService } from './xml2csv.service';

describe('XmlToCsvService', () => {
  let service: XmlToCsvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [XmlToCsvService],
    }).compile();

    service = module.get<XmlToCsvService>(XmlToCsvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
