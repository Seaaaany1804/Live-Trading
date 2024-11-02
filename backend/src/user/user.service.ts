import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(username: string, password: string) {
    // Hash the password before storing
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

    // Compare the hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // Check for 2FA if enabled
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
      // Set up 2FA if not already enabled
      const secret = speakeasy.generateSecret({ name: `YourApp - ${username}` });
      user.google_auth_secret = secret.base32;
      user.is_google_auth_enabled = true;
      await this.userRepository.save(user);

      const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);
      return { message: '2FA setup required', qrCodeUrl };
    }

    return { message: 'Login successful', user };
  }

  async changePassword(username: string, currentPassword: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Compare the current password with the stored hashed password
    const isCurrentPasswordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordMatch) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash the new password before storing
    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);

    return { message: 'Password changed successfully' };
  }
}
