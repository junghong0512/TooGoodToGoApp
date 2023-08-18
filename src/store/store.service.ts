import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StoreResponseDto } from './dto/store.dto';

@Injectable()
export class StoreService {
  constructor(private readonly prismaService: PrismaService) {}

  async getStores(): Promise<StoreResponseDto[]> {
    const stores = await this.prismaService.store.findMany();
    return stores.map((store) => new StoreResponseDto(store));
  }
}
