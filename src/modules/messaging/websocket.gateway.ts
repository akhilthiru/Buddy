import { EventEmitter } from 'node:events';

export interface WsClient {
  userId: string;
  send: (data: string) => void;
  close: () => void;
}

export class WebSocketGateway extends EventEmitter {
  private static instance: WebSocketGateway;
  private clients = new Map<string, Set<WsClient>>();

  static getInstance(): WebSocketGateway {
    if (!this.instance) {
      this.instance = new WebSocketGateway();
    }
    return this.instance;
  }

  registerClient(userId: string, client: WsClient): void {
    if (!this.clients.has(userId)) {
      this.clients.set(userId, new Set());
    }
    this.clients.get(userId)!.add(client);
  }

  unregisterClient(userId: string, client: WsClient): void {
    const userClients = this.clients.get(userId);
    if (userClients) {
      userClients.delete(client);
      if (userClients.size === 0) {
        this.clients.delete(userId);
      }
    }
  }

  isUserOnline(userId: string): boolean {
    const set = this.clients.get(userId);
    return set !== undefined && set.size > 0;
  }

  sendToUser(userId: string, event: string, payload: unknown): boolean {
    const userClients = this.clients.get(userId);
    if (!userClients || userClients.size === 0) {
      return false;
    }

    const message = JSON.stringify({ event, payload });
    for (const client of userClients) {
      try {
        client.send(message);
      } catch (err) {
        console.error(`Failed to send WS message to user ${userId}:`, err);
      }
    }
    return true;
  }
}

export const wsGateway = WebSocketGateway.getInstance();
