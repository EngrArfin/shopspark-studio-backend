import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PlatformService } from './platform.service.js';
import { AddToWishlistRequestDto, WishlistItemDto } from './dto/wishlist.dto.js';

@ApiTags('User Wishlist & Favorites')
@ApiBearerAuth('JWT-auth')
@Controller('favorite')
export class WishlistController {
  constructor(private readonly platformService: PlatformService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get User Wishlist Items',
    description: 'Retrieve bookmarked products and DIY kits saved by the user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Wishlist items retrieved successfully.',
    type: [WishlistItemDto],
  })
  async getWishlist() {
    return this.platformService.getWishlist();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Add Product to Wishlist',
    description: 'Save a catalog product item to the user favorites list.',
  })
  @ApiBody({ type: AddToWishlistRequestDto })
  @ApiResponse({ status: 201, description: 'Product saved to favorites.' })
  async addToWishlist(@Body() dto: AddToWishlistRequestDto) {
    return this.platformService.addToWishlist(dto.product_id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Remove Product from Wishlist',
    description: 'Delete an item from user saved favorites.',
  })
  @ApiParam({ name: 'id', example: 'fav-1' })
  @ApiResponse({ status: 200, description: 'Removed from favorites.' })
  async removeFromWishlist(@Param('id') id: string) {
    return this.platformService.removeFromWishlist(id);
  }
}

