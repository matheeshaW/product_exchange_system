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

  async delete(url: string): Promise<void> {
    try {
      const parts = url.split('/');
      const uploadIndex = parts.findIndex((part) => part === 'upload');

      if (uploadIndex === -1 || uploadIndex + 1 >= parts.length) {
        return;
      }

      const publicIdWithVersion = parts.slice(uploadIndex + 1).join('/');
      const publicId = publicIdWithVersion.replace(/^v\d+\//, '').replace(/\.[^/.]+$/, '');

      if (!publicId) {
        return;
      }

      await cloudinary.uploader.destroy(publicId);
    } catch {
      // Best-effort cleanup; do not fail request if remote delete fails.
    }
  }
}