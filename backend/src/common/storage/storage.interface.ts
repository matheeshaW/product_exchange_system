export interface StorageService {
  upload(file: Buffer): Promise<string>;
}