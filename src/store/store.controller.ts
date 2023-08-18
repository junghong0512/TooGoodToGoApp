import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreResponseDto } from './dto/store.dto';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  getStores(): Promise<StoreResponseDto[]> {
    return this.storeService.getStores();
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
