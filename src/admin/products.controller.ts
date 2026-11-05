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
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminService } from './admin.service.js';
import {
  CreateAdminProductDto,
  ProductsApiResponseDto,
  SingleProductApiResponseDto,
  UpdateAdminProductDto,
} from './dto/admin-product.dto.js';
import {
  CreateAdminDiyActivityDto,
  DiyActivityResponseDto,
  SingleDiyActivityResponseDto,
  UpdateAdminDiyActivityDto,
} from './dto/admin-activity.dto.js';

@ApiBearerAuth('JWT-auth')
@Controller('products')
export class ProductsController {
  constructor(private readonly adminService: AdminService) {}

  // ==========================================
  // DIY ACTIVITIES ENDPOINTS (under /products/activity)
  // ==========================================
  @ApiTags('Admin DIY Activities')
  @Get('activity')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get All DIY Activities (Admin Dashboard)',
    description: 'Retrieve all interactive DIY party activities with instructions, video guides, age ranges, and downloadable PDFs.',
  })
  @ApiQuery({ name: 'search', required: false, example: 'Origami' })
  @ApiResponse({
    status: 200,
    description: 'Activities retrieved successfully.',
    type: DiyActivityResponseDto,
  })
  async getActivities(@Query('search') search?: string): Promise<DiyActivityResponseDto> {
    return this.adminService.getActivities(search);
  }

  @ApiTags('Admin DIY Activities')
  @Post('create-activity')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create New DIY Activity',
    description: 'Add a new craft or activity project with title, age range, instruction steps, video tutorial link, and PDF guide.',
  })
  @ApiBody({ type: CreateAdminDiyActivityDto })
  @ApiResponse({
    status: 201,
    description: 'Activity created successfully.',
    type: SingleDiyActivityResponseDto,
  })
  async createActivity(
    @Body() dto: CreateAdminDiyActivityDto,
  ): Promise<SingleDiyActivityResponseDto> {
    return this.adminService.createActivity(dto);
  }

  @ApiTags('Admin DIY Activities')
  @Patch('update-activity/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update DIY Activity',
    description: 'Modify activity title, instructions, media URLs, or age recommendations.',
  })
  @ApiParam({ name: 'id', description: 'Activity ID', example: 'act-1' })
  @ApiBody({ type: UpdateAdminDiyActivityDto })
  @ApiResponse({
    status: 200,
    description: 'Activity updated successfully.',
    type: SingleDiyActivityResponseDto,
  })
  async updateActivity(
    @Param('id') id: string,
    @Body() dto: UpdateAdminDiyActivityDto,
  ): Promise<SingleDiyActivityResponseDto> {
    return this.adminService.updateActivity(id, dto);
  }

  @ApiTags('Admin DIY Activities')
  @Delete(['delete-activity/:id', 'delet-activity/:id'])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete DIY Activity',
    description: 'Remove an activity from the catalog.',
  })
  @ApiParam({ name: 'id', description: 'Activity ID', example: 'act-1' })
  @ApiResponse({
    status: 200,
    description: 'Activity deleted successfully.',
  })
  async deleteActivity(@Param('id') id: string) {
    return this.adminService.deleteActivity(id);
  }

  // ==========================================
  // PRODUCTS CATALOG ENDPOINTS (under /products)
  // ==========================================
  @ApiTags('Products')
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get All Catalog Products (DIY Boxes & Gifts)',
    description: 'Retrieve the product catalog organized into diyBoxes and gifts collections with full details and pricing.',
  })
  @ApiResponse({
    status: 200,
    description: 'Products catalog retrieved successfully.',
    type: ProductsApiResponseDto,
  })
  async getProducts(): Promise<ProductsApiResponseDto> {
    return this.adminService.getProducts();
  }

  @ApiTags('Products')
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Product by ID',
    description: 'Retrieve full product details, included materials list, associated activities, and imagery.',
  })
  @ApiParam({ name: 'id', description: 'Product ID', example: 'prod-001' })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully.',
    type: SingleProductApiResponseDto,
  })
  async getProductById(@Param('id') id: string): Promise<SingleProductApiResponseDto> {
    return this.adminService.getProductById(id);
  }

  @ApiTags('Products')
  @Get(':id/activity')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Activity for Specific Product',
    description: 'Retrieve the linked DIY activity steps and guides associated with a product box.',
  })
  @ApiParam({ name: 'id', description: 'Product ID or Activity ID', example: 'prod-001' })
  @ApiResponse({
    status: 200,
    description: 'Linked activity retrieved successfully.',
    type: SingleDiyActivityResponseDto,
  })
  async getProductActivity(@Param('id') id: string): Promise<SingleDiyActivityResponseDto> {
    try {
      return await this.adminService.getActivityById(id);
    } catch {
      return this.adminService.getActivityById('act-1');
    }
  }

  @ApiTags('Products')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create New Product (Admin Dashboard)',
    description: 'Add a new DIY box or gift collection item with themes, age ranges, prices, included items, and tutorial links.',
  })
  @ApiBody({ type: CreateAdminProductDto })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully.',
    type: SingleProductApiResponseDto,
  })
  async createProduct(
    @Body() dto: CreateAdminProductDto,
  ): Promise<SingleProductApiResponseDto> {
    return this.adminService.createProduct(dto);
  }

  @ApiTags('Products')
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update Product',
    description: 'Modify product title, description, pricing, discount, included items, or tutorial links.',
  })
  @ApiParam({ name: 'id', description: 'Product ID', example: 'prod-001' })
  @ApiBody({ type: UpdateAdminProductDto })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully.',
    type: SingleProductApiResponseDto,
  })
  async updateProduct(
    @Param('id') id: string,
    @Body() dto: UpdateAdminProductDto,
  ): Promise<SingleProductApiResponseDto> {
    return this.adminService.updateProduct(id, dto);
  }

  @ApiTags('Products')
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete Product',
    description: 'Remove a product item from the catalog.',
  })
  @ApiParam({ name: 'id', description: 'Product ID', example: 'prod-001' })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully.',
  })
  async deleteProduct(@Param('id') id: string) {
    return this.adminService.deleteProduct(id);
  }
}

