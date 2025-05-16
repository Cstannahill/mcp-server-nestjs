// create-post.dto.ts
import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  Allow,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'My First Post' })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({ example: 'This is the content of the post.' })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  content: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Allow()
  published?: boolean;
}
