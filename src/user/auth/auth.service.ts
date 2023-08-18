import { Injectable, ConflictException, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { UserType } from '@prisma/client';

interface SignupParams {
  email: string;
  password: string;
  name: string;
  phone: string;
}

interface SigninParams {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signup({ email, password, phone, name }: SignupParams) {
    const userExist = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (userExist) throw new ConflictException();

    const hashPassword = await bcrypt.hash(password, 10); // 10 salt round at the end

    const user = await this.prismaService.user.create({
      data: {
        email,
        name,
        phone,
        password: hashPassword,
        user_type: UserType.BUYER,
      },
    });

    return await this.generateJWT(name, user.id);
  }

  async signin({ email, password }: SigninParams) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new HttpException('Invalid credentials', 400);
    }

    const hashedPassword = user.password;

    const isValidPassword = bcrypt.compare(password, hashedPassword); // 순서 중요

    if (!isValidPassword) {
      /* HttpException 사용하는 이유: 구체적인 로그인 실패 사유를 제공하지 않기 위해 */
      throw new HttpException('Invalid credentials', 400);
    }

    return await this.generateJWT(user.name, user.id);
  }

  private generateJWT(name: string, id: number) {
    return jwt.sign(
      {
        name,
        id,
      },
      process.env.JWT_KEY,
      { expiresIn: 360000 },
    );
  }
}
