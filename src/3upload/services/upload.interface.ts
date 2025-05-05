export interface UploadService {
    connect(): Promise<void>;
    uploadFile(): Promise<void>;
    disconnect(): Promise<void>;
  }
  