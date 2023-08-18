import { Exclude, Expose } from 'class-transformer';

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
