import { HttpException } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';

interface File {
  mimetype: string;
  originalname: string;
}

export const ImageModule = MulterModule.registerAsync({
  useFactory: async () => {
    return {
      fileFilter: imageFileFilter,
      storage: getImageStorage('images'),
    };
  },
});

const imageFileFilter = (
  _: Request,
  file: File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  const { mimetype, originalname } = file;
  if (isImage(mimetype)) {
    callback(null, true);
  } else {
    callback(
      new HttpException(
        `${extname(originalname)}은 지원하지 않는 확장자입니다.`,
        400,
      ),
      false,
    );
  }
};

const getImageStorage = (destinationPath: string) => {
  const imageStorage = diskStorage({
    destination: (_, __, cb) => cb(null, destinationPath),
    filename: (_, { originalname }, cb) =>
      cb(null, randomImageName(originalname)),
  });
  return imageStorage;
};

const isImage = (mimetype: string): boolean => {
  const matchedMimetypeString: RegExpMatchArray | null = mimetype.match(
    /\/(jpg|jpeg|png|gif)$/,
  );
  const isMatched = matchedMimetypeString !== null;
  return isMatched;
};

const randomImageName = (originalImageName: string) => {
  const randomName = randomUUID();
  const extension = extname(originalImageName);
  const imageName = `${randomName}${extension}`;
  return imageName;
};
