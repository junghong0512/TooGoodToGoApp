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
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { StoreService } from './store.service';
import {
  CreateStoreDto,
  InquireDto,
  StoreResponseDto,
  UpdateStoreDto,
} from './dto/store.dto';
import { User, UserInfo } from 'src/user/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserType } from '@prisma/client';

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

  @Roles(UserType.ADMIN, UserType.SELLER)
  @Post()
  createStore(@Body() body: CreateStoreDto, @User() user: UserInfo) {
    return this.storeService.createStore(body, user?.id);
  }

  @Roles(UserType.ADMIN, UserType.SELLER)
  @Put(':id')
  async updateStore(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateStoreDto,
    @User() user: UserInfo,
  ) {
    const owner = await this.storeService.getOwnerByStoreId(id);

    if (owner.id !== user.id) {
      throw new UnauthorizedException();
    }

    return this.storeService.updateStore(id, body);
  }

  @Roles(UserType.ADMIN, UserType.SELLER)
  @Delete(':id')
  async deleteStore(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserInfo,
  ) {
    const owner = await this.storeService.getOwnerByStoreId(id);

    if (owner.id !== user.id) {
      throw new UnauthorizedException();
    }

    return this.storeService.deleteStoreById(id);
  }

  @Roles('BUYER')
  @Post('/:id/inquire')
  inquire(
    @Param('id', ParseIntPipe) menuId: number,
    @User() user: UserInfo,
    @Body() { message }: InquireDto,
  ) {
    return this.storeService.inquire(user, menuId, message);
  }

  @Roles(UserType.SELLER)
  @Get('/:id/messages')
  async getMenuMessages(
    @Param('id', ParseIntPipe) menuId: number,
    @User() user: UserInfo,
  ) {
    const seller = await this.storeService.getOwnerByMenuId(menuId);

    if (seller.id !== user.id) {
      throw new UnauthorizedException();
    }

    return this.storeService.getMessagesByMenu(menuId);
  }
}
