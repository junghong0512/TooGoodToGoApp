import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

import { UserType } from '@prisma/client';

interface SignupParams {
  email: string;
  password: string;
  name: string;
  phone: string;
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

    return user;
  }
}
