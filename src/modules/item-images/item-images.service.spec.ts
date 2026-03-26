import { Test, TestingModule } from '@nestjs/testing';
import { ItemImagesService } from './item-images.service';

describe('ItemImagesService', () => {
  let service: ItemImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemImagesService],
    }).compile();

    service = module.get<ItemImagesService>(ItemImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
