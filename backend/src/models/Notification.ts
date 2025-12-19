import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  taskId: mongoose.Types.ObjectId;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    taskId: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

notificationSchema.index({ userId: 1, isRead: 1 });

export default mongoose.model<INotification>('Notification', notificationSchema);
