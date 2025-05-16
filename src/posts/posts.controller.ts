// posts.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiCreatedResponse({ description: 'Post created successfully' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @Request()
    req: { user: { userId: number; username: string } },
  ) {
    // Get the user ID from the JWT token
    return this.postsService.create(createPostDto, req.user.userId);
  }

  @ApiOkResponse({ description: 'Get all posts' })
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @ApiOkResponse({ description: 'Get a post by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @ApiOkResponse({ description: 'Update a post' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request()
    req: { user: { userId: number; username: string } },
  ) {
    return this.postsService.update(+id, updatePostDto, req.user.userId);
  }

  @ApiOkResponse({ description: 'Delete a post' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() req: { user: { userId: number; username: string } },
  ) {
    return this.postsService.remove(+id, req.user.userId);
  }
}
