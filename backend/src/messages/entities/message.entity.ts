export class Message {
  id: string;
  text: string;
  role: 'client' | 'agent';
  sentAt: string;
  clientId: string;
  createdAt: Date;
}
