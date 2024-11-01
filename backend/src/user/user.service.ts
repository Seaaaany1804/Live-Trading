import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });
    await this.userRepository.save(user);

    return { message: 'Registration successful', user };
  }

  async login(username: string, password: string, token?: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // If 2FA is enabled, verify the token
    if (user.is_google_auth_enabled) {
      if (!token) {
        throw new UnauthorizedException('2FA token required');
      }
      const verified = speakeasy.totp.verify({
        secret: user.google_auth_secret,
        encoding: 'base32',
        token,
    });
      if (!verified) {
        throw new UnauthorizedException('Invalid 2FA token');
      }
    } else {
      // If 2FA is not enabled, generate and return the QR code for setup
      const secret = speakeasy.generateSecret({ name: `YourApp - ${username}` });
      user.google_auth_secret = secret.base32;
      user.is_google_auth_enabled = true;
      await this.userRepository.save(user);

      const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);
      return { message: '2FA setup required', qrCodeUrl };
    }

    return { message: 'Login successful', user };
  }

  // Method to verify token for future logins
  verifyToken(secret: string, token: string) {
    return speakeasy.totp.verify({ secret, encoding: 'base32', token });
  }
}
