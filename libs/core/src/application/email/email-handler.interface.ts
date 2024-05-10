export interface EmailHandler<T> {
  sendEmail(to: string, data: T): Promise<void>;
}
