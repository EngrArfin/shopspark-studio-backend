import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class WishlistProductDto {
  @ApiProperty({ example: 'prod-001' })
  id: string;

  @ApiProperty({ example: 'Safari Adventure Explorer DIY Party Box' })
  title: string;

  @ApiProperty({ example: 49.99 })
  price: number;

  @ApiProperty({ example: 39.99 })
  discounted_price: number;

  @ApiProperty({ example: 'Complete DIY party craft box with animal masks and binoculars.' })
  description: string;

  @ApiProperty({ example: ['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600'] })
  imges: string[];
}

export class WishlistItemDto {
  @ApiProperty({ example: 'fav-1' })
  id: string;

  @ApiProperty({ type: WishlistProductDto })
  prodcut: WishlistProductDto; // matches frontend interface property name
}

export class AddToWishlistRequestDto {
  @ApiProperty({ example: 'prod-001' })
  @IsNotEmpty()
  @IsString()
  product_id: string;
}

