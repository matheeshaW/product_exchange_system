import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { StorageService } from './storage.interface';

@Injectable()
export class CloudinaryService implements StorageService {
  async upload(file: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'swapify' }, (error, result) => {
          if (error) return reject(error);
          resolve(result?.secure_url || '');
        })
        .end(file);
    });
  }
}