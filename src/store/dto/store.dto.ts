import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class StoreResponseDto {
  id: number;
  name: string;
  address: string;
  description: string;

  @Exclude()
  created_at: Date;

  @Expose({ name: 'createdAt' })
  createdAt() {
    return this.created_at;
  }

  @Exclude()
  updated_at: Date;

  @Exclude()
  owner_id: number;

  @Expose({ name: 'ownerId' })
  ownderId() {
    return this.owner_id;
  }

  storeImage: string;

  constructor(partial: Partial<StoreResponseDto>) {
    Object.assign(this, partial);
  }
}

export class Image {
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Image)
  storeImages: Image[];

  @IsNumber()
  @IsNotEmpty()
  ownerId: number;
}

export class UpdateStoreDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  ownerId?: number;

  //   @IsOptional()
  //   @IsArray()
  //   @ValidateNested({ each: true })
  //   @Type(() => Image)
  //   storeImages: Image[];
}
