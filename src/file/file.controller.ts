// src/file/file.controller.ts
import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';

@ApiTags('files')
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiCreatedResponse({ description: 'File uploaded successfully' })
  uploadFile(@UploadedFile() file: Express.Multer.File): any {
    return this.fileService.uploadFile(file);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Get file by id' })
  getFile(@Param('id') id: string): any {
    return this.fileService.getFile(id);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Delete file by id' })
  deleteFile(@Param('id') _id: string): any {
    // Currently the delete operation is not implemented in MCP
    console.log(_id);
    return this.fileService.deleteFile(_id);
  }
}
