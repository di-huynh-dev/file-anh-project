import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateSubscriberDto } from './dto/create-subscriber.dto'
import { UpdateSubscriberDto } from './dto/update-subscriber.dto'
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Subscriber, SubscriberDocument } from './schemas/subscriber.schema'
import { IUser } from 'src/users/user.interface'
import aqp from 'api-query-params'
import mongoose from 'mongoose'

@Injectable()
export class SubscribersService {
  constructor(@InjectModel(Subscriber.name) private subscriberModel: SoftDeleteModel<SubscriberDocument>) {}
  async create(createSubscriberDto: CreateSubscriberDto, user: IUser) {
    const newSubcriber = await this.subscriberModel.create({
      ...createSubscriberDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    })

    return {
      _id: newSubcriber._id,
      createdAt: newSubcriber.createdAt,
    }
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs)
    delete filter.current
    delete filter.pageSize

    const offset = (+currentPage - 1) * +limit
    const defaultLimit = +limit ? +limit : 10
    const totalItems = (await this.subscriberModel.find(filter)).length
    const totalPages = Math.ceil(totalItems / defaultLimit)

    const result = await this.subscriberModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select(projection as any)
      .exec()

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    }
  }
  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Not found company with ${id}`)
    }
    return await this.subscriberModel.findById({ _id: id })
  }

  async update(updateSubscriberDto: UpdateSubscriberDto, user: IUser) {
    return await this.subscriberModel.updateOne(
      { email: user.email },
      {
        ...updateSubscriberDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
      { upsert: true },
    )
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Not found company with ${id}`)
    }
    await this.subscriberModel.updateOne(
      {
        _id: id,
      },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    )
    return this.subscriberModel.softDelete({
      _id: id,
    })
  }

  async getSkills(user: IUser) {
    const { email } = user
    return await this.subscriberModel.findOne({ email }, { skills: 1 })
  }
}
