export interface GetMessageResponse {
  id: string;
  senderId: string;
  chatId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
