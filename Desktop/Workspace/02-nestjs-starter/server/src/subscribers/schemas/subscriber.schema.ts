import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'

export type SubscriberDocument = HydratedDocument<Subscriber>

@Schema({ timestamps: true })
export class Subscriber {
  @Prop()
  name: string

  @Prop()
  email: string

  @Prop()
  skills: string[]

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
export const SubscriberSchema = SchemaFactory.createForClass(Subscriber)
