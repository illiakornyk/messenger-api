export interface IGetMessageResponse {
  id: string;
  senderId: string;
  chatId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
