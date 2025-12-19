import mongoose, { Document, Schema } from 'mongoose';

export enum TaskPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent'
}

export enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  REVIEW = 'Review',
  COMPLETED = 'Completed'
}

export interface ITask extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  creatorId: mongoose.Types.ObjectId;
  assignedToId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required']
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIUM,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO,
      required: true
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assignedToId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// Indexes for better query performance
taskSchema.index({ creatorId: 1 });
taskSchema.index({ assignedToId: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ dueDate: 1 });

export default mongoose.model<ITask>('Task', taskSchema);
