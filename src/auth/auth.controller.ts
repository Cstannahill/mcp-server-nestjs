import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';

// Define the Request user interface to fix type safety issues
interface RequestWithUser {
  user: {
    userId: number;
    username: string;
  };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({ description: 'User successfully registered' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User created',
    type: CreateUserDto,
  })
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @ApiOkResponse({ description: 'User successfully logged in' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'JWT access token',
    schema: { example: { access_token: 'jwt.token.here' } },
  })
  async login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Remove password before passing to login
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;
    return this.authService.login(userWithoutPassword as User);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOkResponse({
    description: 'Returns the user profile',
    schema: { example: { userId: 1, username: 'john@example.com' } },
  })
  getProfile(@Request() req: RequestWithUser) {
    return req.user;
  }
}
