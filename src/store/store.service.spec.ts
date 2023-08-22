import { Test, TestingModule } from '@nestjs/testing';
import { StoreService } from './store.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

const mockGetStores = [
  {
    id: 30,
    name: '스타벅스 압구정역',
    address: '강남구 압구정동',
    description: '강남구 압구정동 스타벅스',
    storeImage: 'image_url_1',
    store_images: [
      {
        url: 'image_url_1',
      },
    ],
  },
];

describe('StoreService', () => {
  let service: StoreService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreService,
        {
          provide: PrismaService,
          useValue: {
            store: {
              findMany: jest.fn().mockReturnValue(mockGetStores),
            },
          },
        },
      ],
    }).compile();

    service = module.get<StoreService>(StoreService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getStores', () => {
    const filters = {
      address: {
        contains: '압구정동',
      },
    };

    it('Should call prisma store.findMany with correct prarams', async () => {
      const mockPrismaFindManyStores = jest.fn().mockReturnValue(mockGetStores);

      jest
        .spyOn(prismaService.store, 'findMany')
        .mockImplementation(mockPrismaFindManyStores);

      await service.getStores(filters);

      expect(mockPrismaFindManyStores).toBeCalledWith({
        select: {
          id: true,
          name: true,
          address: true,
          description: true,
          store_images: {
            select: {
              url: true,
            },
            take: 1,
          },
        },
        where: filters,
      });
    });

    it('Should throw not found exception if not stores are found', async () => {
      const mockPrismaFindManyStores = jest.fn().mockReturnValue([]);

      jest
        .spyOn(prismaService.store, 'findMany')
        .mockImplementation(mockPrismaFindManyStores);

      await expect(service.getStores(filters)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
