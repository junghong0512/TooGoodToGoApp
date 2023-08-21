import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StoreResponseDto } from './dto/store.dto';
import { UserInfo } from 'src/user/decorators/user.decorator';

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
}

interface UpdateStoreParams {
  name?: string;
  address?: string;
  description?: string;
  ownerId?: number;
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

  async createStore(
    { name, address, description, storeImages }: CreateStoreParams,
    userId: number,
  ) {
    const store = await this.prismaService.store.create({
      data: {
        name,
        address,
        description,
        owner_id: userId,
      },
    });

    const storeImgs = storeImages.map((img) => ({
      ...img,
      store_id: store.id,
    }));
    await this.prismaService.storeImage.createMany({
      data: storeImgs,
    });

    return new StoreResponseDto(store);
  }

  async updateStore(id: number, data: UpdateStoreParams) {
    const store = await this.prismaService.store.findUnique({
      where: {
        id,
      },
    });

    if (!store) {
      throw new NotFoundException();
    }

    const updatedStore = await this.prismaService.store.update({
      where: {
        id,
      },
      data,
    });

    return new StoreResponseDto(updatedStore);
  }

  async deleteStoreById(id: number) {
    await this.prismaService.storeImage.deleteMany({
      where: {
        store_id: id,
      },
    });

    await this.prismaService.store.delete({
      where: {
        id,
      },
    });
  }

  async getOwnerByStoreId(id: number) {
    const store = await this.prismaService.store.findUnique({
      where: {
        id,
      },
      select: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!store) {
      throw new NotFoundException();
    }

    return store.owner;
  }

  async getOwnerByMenuId(id: number) {
    const store = await this.prismaService.menu.findUnique({
      where: {
        id,
      },
      select: {
        store_id: true,
      },
    });

    if (!store) {
      throw new NotFoundException();
    }

    return await this.getOwnerByStoreId(store.store_id);
  }

  async inquire(buyer: UserInfo, menuId: number, message: string) {
    const seller = await this.getOwnerByMenuId(menuId);

    return await this.prismaService.message.create({
      data: {
        message,
        seller_id: seller.id,
        buyer_id: buyer.id,
        menu_id: menuId,
      },
    });
  }

  getMessagesByMenu(menuId: number) {
    return this.prismaService.message.findMany({
      where: {
        menu_id: menuId,
      },
      select: {
        message: true,
        buyer: {
          select: {
            name: true,
            phone: true,
            email: true,
          },
        },
      },
    });
  }
}
