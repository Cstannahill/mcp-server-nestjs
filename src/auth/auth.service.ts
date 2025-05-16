// auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.usersService.findByEmail(email);
      if (user && (await bcrypt.compare(password, user.password))) {
        return user;
      }
      return null;
    } catch (e) {
      console.error('Error validating user:', e);
      return null;
    }
  }

  login(user: User) {
    // Create JWT payload
    const payload = { username: user.email, sub: user.id };

    // Return JWT token
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    // Hash the password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create a new user with the hashed password
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // Remove password from the returned user object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...result } = newUser;
    return result;
  }
}
