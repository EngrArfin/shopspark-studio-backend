import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
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
import { AdminService } from './admin.service.js';
import {
  AdminAffiliatedProductDto,
  AffiliatedProductsResponseDto,
  CreateAffiliatedProductDto,
  SingleAffiliatedProductResponseDto,
  UpdateAffiliatedProductDto,
} from './dto/admin-affiliated-product.dto.js';

@ApiTags('Admin Affiliated Products')
@ApiBearerAuth('JWT-auth')
@Controller('affiliated-products')
export class AffiliatedProductsController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get All Affiliated Products (Admin & Public)',
    description: 'Retrieve curated third-party party accessory links with partner ratings, company info, and redirect URLs.',
  })
  @ApiResponse({
    status: 200,
    description: 'Affiliated products retrieved successfully.',
    type: AffiliatedProductsResponseDto,
  })
  async getAffiliatedProducts(): Promise<AffiliatedProductsResponseDto> {
    return this.adminService.getAffiliatedProducts();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Affiliated Product by ID',
    description: 'Retrieve details of an affiliate recommendation.',
  })
  @ApiParam({ name: 'id', description: 'Product ID', example: 'aff-01' })
  @ApiResponse({
    status: 200,
    description: 'Affiliated product retrieved successfully.',
    type: SingleAffiliatedProductResponseDto,
  })
  async getAffiliatedProductById(
    @Param('id') id: string,
  ): Promise<SingleAffiliatedProductResponseDto> {
    return this.adminService.getAffiliatedProductById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create New Affiliated Product',
    description: 'Add a new affiliate product link with partner details, price, age recommendations, and tracking links.',
  })
  @ApiBody({ type: CreateAffiliatedProductDto })
  @ApiResponse({
    status: 201,
    description: 'Affiliated product created successfully.',
    type: SingleAffiliatedProductResponseDto,
  })
  async createAffiliatedProduct(
    @Body() dto: CreateAffiliatedProductDto,
  ): Promise<SingleAffiliatedProductResponseDto> {
    return this.adminService.createAffiliatedProduct(dto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update Affiliated Product',
    description: 'Modify title, price, company name, or affiliate link.',
  })
  @ApiParam({ name: 'id', description: 'Product ID', example: 'aff-01' })
  @ApiBody({ type: UpdateAffiliatedProductDto })
  @ApiResponse({
    status: 200,
    description: 'Affiliated product updated successfully.',
    type: SingleAffiliatedProductResponseDto,
  })
  async updateAffiliatedProduct(
    @Param('id') id: string,
    @Body() dto: UpdateAffiliatedProductDto,
  ): Promise<SingleAffiliatedProductResponseDto> {
    return this.adminService.updateAffiliatedProduct(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete Affiliated Product',
    description: 'Remove an affiliated product item from recommendations.',
  })
  @ApiParam({ name: 'id', description: 'Product ID', example: 'aff-01' })
  @ApiResponse({
    status: 200,
    description: 'Affiliated product deleted successfully.',
  })
  async deleteAffiliatedProduct(@Param('id') id: string) {
    return this.adminService.deleteAffiliatedProduct(id);
  }
}

