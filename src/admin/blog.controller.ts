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
  BlogsApiResponseDto,
  CreateAdminBlogDto,
  SingleBlogApiResponseDto,
  UpdateAdminBlogDto,
} from './dto/admin-blog.dto.js';

@ApiTags('Admin Blogs')
@ApiBearerAuth('JWT-auth')
@Controller('blog')
export class BlogController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get All Blogs (Admin & Public)',
    description: 'Retrieve list of published articles, party ideas, parenting tips, and guides.',
  })
  @ApiResponse({
    status: 200,
    description: 'Blog posts retrieved successfully.',
    type: BlogsApiResponseDto,
  })
  async getBlogs(): Promise<BlogsApiResponseDto> {
    return this.adminService.getBlogs();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Blog Post by ID',
    description: 'Retrieve complete blog article with badges, tags, and banner imagery.',
  })
  @ApiParam({ name: 'id', description: 'Blog ID', example: 'blog-1' })
  @ApiResponse({
    status: 200,
    description: 'Blog post retrieved successfully.',
    type: SingleBlogApiResponseDto,
  })
  async getBlogById(@Param('id') id: string): Promise<SingleBlogApiResponseDto> {
    return this.adminService.getBlogById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create New Blog Post',
    description: 'Publish a new blog post with title, description, conclusion, category badges, tags, and cover images.',
  })
  @ApiBody({ type: CreateAdminBlogDto })
  @ApiResponse({
    status: 201,
    description: 'Blog created successfully.',
    type: SingleBlogApiResponseDto,
  })
  async createBlog(
    @Body() dto: CreateAdminBlogDto,
  ): Promise<SingleBlogApiResponseDto> {
    return this.adminService.createBlog(dto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update Blog Post',
    description: 'Modify blog content, tags, or cover media.',
  })
  @ApiParam({ name: 'id', description: 'Blog ID', example: 'blog-1' })
  @ApiBody({ type: UpdateAdminBlogDto })
  @ApiResponse({
    status: 200,
    description: 'Blog updated successfully.',
    type: SingleBlogApiResponseDto,
  })
  async updateBlog(
    @Param('id') id: string,
    @Body() dto: UpdateAdminBlogDto,
  ): Promise<SingleBlogApiResponseDto> {
    return this.adminService.updateBlog(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete Blog Post',
    description: 'Delete a blog post from the platform.',
  })
  @ApiParam({ name: 'id', description: 'Blog ID', example: 'blog-1' })
  @ApiResponse({
    status: 200,
    description: 'Blog deleted successfully.',
  })
  async deleteBlog(@Param('id') id: string) {
    return this.adminService.deleteBlog(id);
  }
}

