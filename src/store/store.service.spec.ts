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

const mockStore = {
  id: 1,
  name: '스타벅스 압구정역',
  address: '강남구 압구정동',
  description: '강남구 압구정동 스타벅스',
};

const mockStoreImage = [
  {
    id: 1,
    url: 'image_url_1',
  },
  {
    id: 2,
    url: 'image_url_1',
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
              create: jest.fn().mockReturnValue(mockStore),
            },
            storeImage: {
              createMany: jest.fn().mockReturnValue(mockStoreImage),
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

  /* GET STORES */
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

  /* CREATE STORE */
  describe('createStore', () => {
    const mockCreateStoreParams = {
      name: '서울시 마포구 공덕동 스타벅스',
      address: '서울시 마포구 공덕동',
      description: '서울시 마포구 공덕동 스타벅스',
      storeImages: [{ url: 'store_img_url_1' }, { url: 'store_img_url_2' }],
    };

    it('should call prisma store.create with the correct payload', async () => {
      const mockCreateStore = jest.fn().mockReturnValue(mockStore);

      jest
        .spyOn(prismaService.store, 'create')
        .mockImplementation(mockCreateStore);

      await service.createStore(mockCreateStoreParams, 10);

      expect(mockCreateStore).toBeCalledWith({
        data: {
          name: '서울시 마포구 공덕동 스타벅스',
          address: '서울시 마포구 공덕동',
          description: '서울시 마포구 공덕동 스타벅스',
          owner_id: 10,
        },
      });
    });

    it('Should call prisma image.createMany with the correct payload', async () => {
      const mockCreateManyStoreImage = jest
        .fn()
        .mockReturnValue(mockStoreImage);

      jest
        .spyOn(prismaService.storeImage, 'createMany')
        .mockImplementation(mockCreateManyStoreImage);

      await service.createStore(mockCreateStoreParams, 10);

      expect(mockCreateManyStoreImage).toBeCalledWith({
        data: [
          {
            store_id: 1,
            url: 'store_img_url_1',
          },
          {
            store_id: 1,
            url: 'store_img_url_2',
          },
        ],
      });
    });
  });
});
