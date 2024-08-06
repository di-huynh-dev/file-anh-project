import mongoose, { HydratedDocument } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type PermissionDocument = HydratedDocument<Permission>

@Schema({ timestamps: true })
export class Permission {
  @Prop()
  name: string

  @Prop()
  apiPath: string

  @Prop()
  method: string

  @Prop()
  module: string

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

export const PermissionSchema = SchemaFactory.createForClass(Permission)
