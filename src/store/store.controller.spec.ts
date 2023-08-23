import { Test, TestingModule } from '@nestjs/testing';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';

const mockUser = {
  id: 10,
  name: 'JUNG HONG',
  phone: '01099564014',
  email: 'junghong0512@gmail.com',
};

const mockStore = {
  id: 1,
  name: '스타벅스 압구정역',
  address: '강남구 압구정동',
  description: '강남구 압구정동 스타벅스',
};

describe('StoreController', () => {
  let controller: StoreController;
  let storeService: StoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreController],
      providers: [
        {
          provide: StoreService,
          useValue: {
            getStores: jest.fn().mockReturnValue([]),
            getOwnerByStoreId: jest.fn().mockReturnValue(mockUser),
            updateStore: jest.fn().mockReturnValue(mockStore),
          },
        },
        PrismaService,
      ],
    }).compile();

    controller = module.get<StoreController>(StoreController);
    storeService = module.get<StoreService>(StoreService);
  });

  describe('getStores', () => {
    it('should construct filter object correctly', async () => {
      const mockGetStores = jest.fn().mockReturnValue([]);

      jest.spyOn(storeService, 'getStores').mockImplementation(mockGetStores);

      await controller.getStores('강남구');

      expect(mockGetStores).toBeCalledWith({
        address: { contains: '강남구' },
      });
    });
  });

  describe('updateStore', () => {
    const mockUserInfo = {
      name: 'JUNG HONG',
      id: 30,
      iat: 1,
      exp: 2,
    };

    const mockUpdateStoreParams = {
      name: '서울시 마포구 공덕동 스타벅스',
      address: '서울시 마포구 공덕동',
      description: '서울시 마포구 공덕동 스타벅스',
    };

    it("should throw unauth error if seller didn't create store", async () => {
      await expect(
        controller.updateStore(5, mockUpdateStoreParams, mockUserInfo),
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('should update store if seller id is valid', async () => {
      const mockUpdateStore = jest.fn().mockReturnValue(mockStore);

      jest
        .spyOn(storeService, 'updateStore')
        .mockImplementation(mockUpdateStore);

      await controller.updateStore(5, mockUpdateStoreParams, {
        ...mockUserInfo,
        id: 10,
      });

      expect(mockUpdateStore).toBeCalled();
    });
  });
});
