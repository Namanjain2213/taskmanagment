import User, { IUser } from '../models/User';
import mongoose from 'mongoose';

/**
 * Data access layer for User operations
 */
export class UserRepository {
  async create(data: { name: string; email: string; password: string }): Promise<IUser> {
    return await User.create(data);
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).select('+password');
  }

  async findAll(): Promise<IUser[]> {
    return await User.find().select('_id name email');
  }

  async updateById(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await User.countDocuments({ email });
    return count > 0;
  }
}
