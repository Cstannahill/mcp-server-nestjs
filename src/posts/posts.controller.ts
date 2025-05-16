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
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBody,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiCreatedResponse({ description: 'Post created successfully' })
  @ApiBody({ type: CreatePostDto })
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

  @ApiOkResponse({
    description: 'Get all posts',
    schema: {
      example: [
        {
          id: 1,
          title: 'My First Post',
          content: 'This is the content of the post.',
          published: true,
          author: { id: 1, name: 'John Doe' },
          createdAt: '2025-05-15T00:00:00.000Z',
          updatedAt: '2025-05-15T00:00:00.000Z',
        },
      ],
    },
  })
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @ApiOkResponse({
    description: 'Get a post by id',
    schema: {
      example: {
        id: 1,
        title: 'My First Post',
        content: 'This is the content of the post.',
        published: true,
        author: { id: 1, name: 'John Doe' },
        createdAt: '2025-05-15T00:00:00.000Z',
        updatedAt: '2025-05-15T00:00:00.000Z',
      },
    },
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @ApiOkResponse({ description: 'Update a post' })
  @ApiBody({ type: UpdatePostDto })
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
