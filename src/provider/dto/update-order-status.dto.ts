import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from './order.dto.js';

export class UpdateOrderStatusDto {
  @ApiProperty({
    example: 'SHIPPED',
    enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
    description: 'New fulfillment status to apply to this order',
  })
  @IsNotEmpty()
  @IsIn(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
  status: OrderStatus;

  @ApiPropertyOptional({
    example: 'FDX-99823411',
    description: 'Shipping tracking number (required or recommended when status is SHIPPED)',
  })
  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @ApiPropertyOptional({
    example: 'FedEx Express',
    description: 'Courier or delivery service provider name',
  })
  @IsOptional()
  @IsString()
  carrier?: string;

  @ApiPropertyOptional({
    example: 'Dispatched from central distribution hub.',
    description: 'Internal or customer-visible event note',
  })
  @IsOptional()
  @IsString()
  note?: string;
}
