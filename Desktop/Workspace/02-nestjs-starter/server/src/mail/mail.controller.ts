import { Controller, Get } from '@nestjs/common'
import { MailService } from './mail.service'
import { Public, ResponseMessage } from 'src/auth/decorator/customize'
import { MailerService } from '@nestjs-modules/mailer'
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose'
import { Subscriber, SubscriberDocument } from 'src/subscribers/schemas/subscriber.schema'
import { Job, JobDocument } from 'src/jobs/schemas/job.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Cron, CronExpression } from '@nestjs/schedule'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('mail')
@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private mailerService: MailerService,

    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<SubscriberDocument>,
    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>,
  ) {}

  @Get()
  @Public()
  @ResponseMessage('Gửi email thành công!')
  @Cron('7 0 0 * * 0') //7:00 AM every sunday
  async handleTestEmail() {
    const subscribers = await this.subscriberModel.find({})
    for (const subs of subscribers) {
      const subsSkills = subs.skills
      const jobWithMatchingSkills = await this.jobModel.find({ skills: { $in: subsSkills } })
      //todo
      //build template
      if (jobWithMatchingSkills.length > 0) {
        const jobs = jobWithMatchingSkills.map((item) => {
          return {
            name: item.name,
            company: item.company.name,
            salary: `${item.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ',
            skills: item.skills,
          }
        })
        await this.mailerService.sendMail({
          to: subs.email,
          from: '"Support Team" <support@example.com>', // override default from
          subject: `${jobWithMatchingSkills.length} Việc mới dành cho bạn trong tuần `,
          template: 'jobs', // HTML body content
          context: {
            receiver: subs.name,
            jobs: jobs,
          },
        })
      }
    }
  }
}
