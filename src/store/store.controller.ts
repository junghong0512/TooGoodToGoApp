import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto, StoreResponseDto } from './dto/store.dto';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  getStores(
    @Query('address') address?: string,
    // @Query('distance') distance?: string,
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
  getStore(@Param('id', ParseIntPipe) id: number) {
    return this.storeService.getStoreById(id);
  }

  @Post()
  createStore(@Body() body: CreateStoreDto) {
    console.log(body);
    return this.storeService.createStore(body);
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
