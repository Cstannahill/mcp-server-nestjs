// posts.service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createPostDto: CreatePostDto, userId: number): Promise<Post> {
    const author = await this.usersRepository.findOneBy({ id: userId });

    if (!author) {
      throw new NotFoundException('User not found');
    }

    const newPost = this.postsRepository.create({
      ...createPostDto,
      author,
    });

    return this.postsRepository.save(newPost);
  }

  findAll(): Promise<Post[]> {
    return this.postsRepository.find({
      relations: ['author'], // Load author relation
    });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    userId: number,
  ): Promise<Post> {
    const post = await this.findOne(id);

    // Check if the user is the author
    if (post.author.id !== userId) {
      throw new UnauthorizedException('You can only update your own posts');
    }

    // Update the post
    Object.assign(post, updatePostDto);
    post.updatedAt = new Date();

    return this.postsRepository.save(post);
  }

  async remove(id: number, userId: number): Promise<void> {
    const post = await this.findOne(id);

    // Check if the user is the author
    if (post.author.id !== userId) {
      throw new UnauthorizedException('You can only delete your own posts');
    }

    await this.postsRepository.delete(id);
  }
}
