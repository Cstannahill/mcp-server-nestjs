// create-post.dto.ts
import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  Allow,
} from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  content: string;

  @IsOptional()
  @Allow()
  published?: boolean;
}
