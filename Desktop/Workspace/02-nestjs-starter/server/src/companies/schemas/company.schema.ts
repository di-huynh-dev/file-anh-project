import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'

export type CompanyDocument = HydratedDocument<Company>

@Schema({ timestamps: true })
export class Company {
  @Prop()
  name: string

  @Prop()
  address: string

  @Prop()
  description: string

  @Prop()
  logo: string

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

  @Prop({ type: Date, default: Date.now })
  createdAt: Date

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date

  @Prop()
  isDeleted: boolean

  @Prop({ type: Date, default: Date.now })
  deletedAt: Date
}

export const CompanySchema = SchemaFactory.createForClass(Company)
