import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common'
import { FilesService } from './files.service'
import { UpdateFileDto } from './dto/update-file.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { ResponseMessage } from 'src/auth/decorator/customize'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('fileUpload'))
  @ResponseMessage('Upload file thành công!')
  uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|image\/jpeg|png|image\/png|application\/pdf)$/,
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return {
      fileName: file.filename,
    }
  }

  @Get()
  findAll() {
    return this.filesService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(+id, updateFileDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(+id)
  }
}
