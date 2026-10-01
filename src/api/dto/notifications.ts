export type NotificationDto = {
  id: string;
  type: string;
  title: string;
  message: string;
  actionUrl: string;
  imageUrl?: string;
  read: boolean;
  createdAt: string;
};
