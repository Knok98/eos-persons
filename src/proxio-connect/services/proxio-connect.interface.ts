export interface IFtpConnectService {
    connect(): Promise<void>;
    uploadFile(): Promise<void>;
    disconnect(): Promise<void>;
  }
  