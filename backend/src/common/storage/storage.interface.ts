export interface StorageService {
  upload(file: Buffer): Promise<string>;
  delete?(url: string): Promise<void>;
}