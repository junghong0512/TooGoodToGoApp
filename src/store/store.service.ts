import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StoreResponseDto } from './dto/store.dto';

interface GetStoresParam {
  address?: {
    contains: string;
  };
}

interface CreateStoreParams {
  name: string;
  address: string;
  description: string;
  storeImages: { url: string }[];
  ownerId: number;
}

@Injectable()
export class StoreService {
  constructor(private readonly prismaService: PrismaService) {}

  async getStores(filters: GetStoresParam): Promise<StoreResponseDto[]> {
    const stores = await this.prismaService.store.findMany({
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

    if (!stores.length) {
      throw new NotFoundException();
    }

    /* 방법 1 */
    // return stores.map((store) => new StoreResponseDto(store));

    /* 방법 2 */
    // return stores.map(
    //   (store) =>
    //     new StoreResponseDto({
    //       ...store,
    //       storeImage: store.store_images[0].url,
    //     }),
    // );

    /* 방법 3 */
    return stores.map((store) => {
      const fetchStore = { ...store, storeImage: store.store_images[0].url };
      delete fetchStore.store_images;
      return new StoreResponseDto(fetchStore);
    });
  }

  async getStoreById(id: number) {
    const store = await this.prismaService.store.findUnique({
      where: {
        id,
      },
    });

    if (!store) {
      throw new NotFoundException();
    }

    return new StoreResponseDto(store);
  }

  async createStore({
    name,
    address,
    description,
    storeImages,
    ownerId,
  }: CreateStoreParams) {
    const store = await this.prismaService.store.create({
      data: {
        name,
        address,
        description,
        owner_id: ownerId,
      },
    });

    const storeImgs = storeImages.map((img) => ({
      ...img,
      store_id: store.id,
    }));
    // await this.prismaService.storeImage.createMany({
    //   data: storeImgs,
    // });

    return new StoreResponseDto(store);
  }
}
