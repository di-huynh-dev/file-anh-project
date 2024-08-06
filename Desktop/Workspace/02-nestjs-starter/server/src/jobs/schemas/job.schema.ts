import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'

export type JobDocument = HydratedDocument<Job>

@Schema({ timestamps: true })
export class Job {
  @Prop()
  name: string

  @Prop()
  skills: string[]

  @Prop({ type: Object })
  company: {
    _id: mongoose.Schema.Types.ObjectId
    name: string
    logo: string
  }

  @Prop()
  location: string

  @Prop()
  salary: number

  @Prop()
  quantity: number

  @Prop()
  level: string

  @Prop()
  description: string

  @Prop()
  logo: string

  @Prop({ type: Date, default: Date.now })
  startDate: Date

  @Prop({ type: Date, default: Date.now })
  endDate: Date

  @Prop()
  isActive: boolean

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId
    email: string
  }

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId
    email: string
  }

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId
    email: string
  }

  @Prop()
  isDeleted: boolean

  @Prop({ type: Date, default: Date.now })
  deletedAt: Date

  @Prop({ type: Date, default: Date.now })
  createdAt: Date

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date
}
export const JobSchema = SchemaFactory.createForClass(Job)
