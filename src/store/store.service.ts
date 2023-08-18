import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StoreResponseDto } from './dto/store.dto';

@Injectable()
export class StoreService {
  constructor(private readonly prismaService: PrismaService) {}

  async getStores(): Promise<StoreResponseDto[]> {
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
    });
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
}
