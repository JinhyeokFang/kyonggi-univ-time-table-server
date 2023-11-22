import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

export const ImageInterceptor = FileInterceptor('image');
export const ImagesInterceptor = FilesInterceptor('images');
