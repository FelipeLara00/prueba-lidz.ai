type ClientDebt = {
  id: string;
  institution: string;
  amount: number;
  dueDate: Date;
  clientId: string;
  createdAt: Date;
};

type ClientMessage = {
  id: string;
  text: string;
  role: 'client' | 'agent';
  sentAt: Date;
  clientId: string;
  createdAt: Date;
};

export class Client {
  id: string;
  name: string;
  rut: string;
  salary: number;
  savings: number;
  createdAt: Date;
  updatedAt: Date;
  debts?: ClientDebt[];
  messages?: ClientMessage[];
}
