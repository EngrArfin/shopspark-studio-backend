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
import { PlatformService } from './platform.service.js';
import {
  CreateTaskRequestDto,
  TaskDto,
  UpdateTaskRequestDto,
} from './dto/tasks.dto.js';

@ApiTags('Party Tasks & Checklist')
@ApiBearerAuth('JWT-auth')
@Controller('tasks')
export class TasksController {
  constructor(private readonly platformService: PlatformService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get All Checklist Tasks',
    description: 'Retrieve party planning to-do tasks and checklists.',
  })
  @ApiResponse({ status: 200, description: 'Tasks list retrieved.' })
  async getTasks() {
    return this.platformService.getTasks();
  }

  @Get('by-category')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Tasks Grouped by Category',
    description: 'Retrieve checklist items grouped by functional category (Decorations, Cake, Invitations, Activities).',
  })
  @ApiResponse({ status: 200, description: 'Grouped tasks retrieved.' })
  async getTasksByCategory() {
    return this.platformService.getTasksByCategory();
  }

  @Get('timeline')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Tasks Timeline Schedule',
    description: 'Retrieve checklist items sorted into chronological buckets: today, next 2 days, this week, and later.',
  })
  @ApiResponse({ status: 200, description: 'Timeline tasks retrieved.' })
  async getTasksTimeline() {
    return this.platformService.getTasksTimeline();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Task by ID',
    description: 'Retrieve single task details.',
  })
  @ApiParam({ name: 'id', example: 'task-1' })
  @ApiResponse({ status: 200, description: 'Task details retrieved.', type: TaskDto })
  async getTaskById(@Param('id') id: string) {
    return this.platformService.getTaskById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create New Checklist Task',
    description: 'Add a new planning task with category, priority, and due date.',
  })
  @ApiBody({ type: CreateTaskRequestDto })
  @ApiResponse({ status: 201, description: 'Task created successfully.' })
  async createTask(@Body() dto: CreateTaskRequestDto) {
    return this.platformService.createTask(dto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update Task (Completion Status / Priority)',
    description: 'Toggle task complete status or change deadline and description.',
  })
  @ApiParam({ name: 'id', example: 'task-1' })
  @ApiBody({ type: UpdateTaskRequestDto })
  @ApiResponse({ status: 200, description: 'Task updated successfully.' })
  async updateTask(
    @Param('id') id: string,
    @Body() dto: UpdateTaskRequestDto,
  ) {
    return this.platformService.updateTask(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete Task',
    description: 'Remove a task from the checklist.',
  })
  @ApiParam({ name: 'id', example: 'task-1' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully.' })
  async deleteTask(@Param('id') id: string) {
    return this.platformService.deleteTask(id);
  }
}

