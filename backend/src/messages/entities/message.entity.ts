export class Message {
  id: string;
  text: string;
  role: 'client' | 'agent';
  sentAt: Date;
  clientId: string;
  createdAt: Date;
}
