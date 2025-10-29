/**
 * Report Model
 * Defines schema for custom analytics reports with export capabilities
 */

import mongoose, { Document, Schema } from 'mongoose';
import { ReportStatus } from '../types';

/**
 * Report filter configuration
 */
export interface IReportFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin';
  value: string | number | string[] | number[];
}

/**
 * Report chart configuration
 */
export interface IReportChart {
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter';
  title: string;
  metrics: string[];
  xAxis?: string;
  yAxis?: string;
}

/**
 * Report document interface
 */
export interface IReport extends Document {
  userId: mongoose.Types.ObjectId;
  teamId?: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  type: 'analytics' | 'performance' | 'engagement' | 'custom';
  status: ReportStatus;
  schedule?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    dayOfWeek?: number;
    dayOfMonth?: number;
    time: string;
    recipients: string[];
  };
  dateRange: {
    start: Date;
    end: Date;
  };
  filters: IReportFilter[];
  metrics: string[];
  dimensions: string[];
  charts: IReportChart[];
  format: 'pdf' | 'csv' | 'xlsx' | 'json';
  fileUrl?: string;
  fileSize?: number;
  generatedAt?: Date;
  error?: string;
  metadata: {
    rowCount?: number;
    processingTime?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Report schema definition
 */
const reportSchema = new Schema<IReport>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Report name is required'],
      trim: true,
      maxlength: [200, 'Report name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    type: {
      type: String,
      enum: ['analytics', 'performance', 'engagement', 'custom'],
      default: 'custom',
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(ReportStatus),
      default: ReportStatus.PENDING,
      index: true,
    },
    schedule: {
      enabled: {
        type: Boolean,
        default: false,
      },
      frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
      },
      dayOfWeek: {
        type: Number,
        min: 0,
        max: 6,
      },
      dayOfMonth: {
        type: Number,
        min: 1,
        max: 31,
      },
      time: String,
      recipients: [String],
    },
    dateRange: {
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
    },
    filters: [
      {
        field: {
          type: String,
          required: true,
        },
        operator: {
          type: String,
          enum: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'nin'],
          required: true,
        },
        value: Schema.Types.Mixed,
      },
    ],
    metrics: [
      {
        type: String,
        required: true,
      },
    ],
    dimensions: [String],
    charts: [
      {
        type: {
          type: String,
          enum: ['line', 'bar', 'pie', 'area', 'scatter'],
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        metrics: [String],
        xAxis: String,
        yAxis: String,
      },
    ],
    format: {
      type: String,
      enum: ['pdf', 'csv', 'xlsx', 'json'],
      default: 'pdf',
    },
    fileUrl: String,
    fileSize: Number,
    generatedAt: Date,
    error: String,
    metadata: {
      rowCount: Number,
      processingTime: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
reportSchema.index({ userId: 1, status: 1, createdAt: -1 });
reportSchema.index({ teamId: 1, status: 1, createdAt: -1 });
reportSchema.index({ 'schedule.enabled': 1, status: 1 });

export default mongoose.model<IReport>('Report', reportSchema);
