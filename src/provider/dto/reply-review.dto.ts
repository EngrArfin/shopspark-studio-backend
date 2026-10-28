import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ReviewDto } from './review.dto.js';

export class ReplyReviewDto {
  @ApiProperty({
    example: 'Thank you for your feedback! We are thrilled to hear you enjoy the product.',
    description: 'Provider response text message to customer review',
  })
  @IsString()
  @IsNotEmpty()
  reply: string;
}

export class ReplyReviewResponseDto {
  @ApiProperty({ example: true, description: 'Success flag' })
  success: boolean;

  @ApiProperty({ example: 'Reply posted successfully', description: 'Status message' })
  message: string;

  @ApiProperty({ type: ReviewDto, description: 'Updated review record' })
  review: ReviewDto;
}
