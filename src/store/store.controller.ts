import { Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreResponseDto } from './dto/store.dto';
import { filter } from 'rxjs';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  getStores(
    @Query('address') address?: string,
    @Query('distance') distance?: string,
  ): Promise<StoreResponseDto[]> {
    /* 코드 예시
    const price = minPrice || maxPrice ? {
        ...(minPrice && { gte: parseFloat(minPrice) }),
        ...(maxPRice && { lte: parseFloat(maxPrice) })
    } : undefined
    
    const filter = {
        ...(city && { city }),
        ...(price && { price }),
        ...(propertyType && { propertyType })
    } 
    */

    const addr = address
      ? { ...(address && { contains: address }) }
      : undefined;

    const filters = {
      ...(addr && { address: addr }),
    };
    return this.storeService.getStores(filters);
  }
  @Get(':id')
  getStore() {
    return {};
  }

  @Post()
  createStore() {
    return {};
  }

  @Put(':id')
  updateStore() {
    return {};
  }

  @Delete(':id')
  deleteStore() {
    return;
  }
}
