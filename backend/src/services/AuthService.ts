import { UserRepository } from '../repositories/UserRepository';
import { RegisterDto, LoginDto, UpdateProfileDto } from '../dto/auth.dto';
import { ConflictError, UnauthorizedError, NotFoundError } from '../utils/errors';
import { IUser } from '../models/User';

/**
 * Business logic for authentication and user management
 */
export class AuthService {
  constructor(private userRepository: UserRepository) {}

  /**
   * Register a new user
   * @param data - User registration data
   * @returns Created user without password
   */
  async register(data: RegisterDto): Promise<Omit<IUser, 'password'>> {
    const exists = await this.userRepository.existsByEmail(data.email);
    if (exists) {
      throw new ConflictError('Email already registered');
    }

    const user = await this.userRepository.create(data);
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  /**
   * Authenticate user with email and password
   * @param data - Login credentials
   * @returns Authenticated user without password
   */
  async login(data: LoginDto): Promise<Omit<IUser, 'password'>> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await user.comparePassword(data.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  /**
   * Get user by ID
   * @param userId - User ID
   * @returns User data without password
   */
  async getUserById(userId: string): Promise<Omit<IUser, 'password'>> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  /**
   * Update user profile
   * @param userId - User ID
   * @param data - Profile update data
   * @returns Updated user without password
   */
  async updateProfile(userId: string, data: UpdateProfileDto): Promise<Omit<IUser, 'password'>> {
    const user = await this.userRepository.updateById(userId, data);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  /**
   * Get all users (for task assignment)
   * @returns List of all users
   */
  async getAllUsers(): Promise<IUser[]> {
    return await this.userRepository.findAll();
  }
}
