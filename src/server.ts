import http from 'node:http';
import { app } from './app.ts';
import { env } from './config/env.ts';
import { wsGateway, type WsClient } from './modules/messaging/websocket.gateway.ts';
import { JwtUtil } from './common/utils/jwt.ts';
import { seedDevelopmentData } from './database/seeds.ts';

const server = http.createServer((req, res) => {
  app.handleRequest(req, res);
});

// Real-Time WebSocket Handshake & Gateway Integration
server.on('upgrade', (req, socket) => {
  const urlObj = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  if (urlObj.pathname !== '/ws') {
    socket.destroy();
    return;
  }

  const token = urlObj.searchParams.get('token');
  if (!token) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  try {
    const decoded = JwtUtil.verify(token, env.JWT_SECRET);
    const userId = decoded.sub;

    // WebSocket handshake confirmation
    socket.write(
      'HTTP/1.1 101 Switching Protocols\r\n' +
        'Upgrade: websocket\r\n' +
        'Connection: Upgrade\r\n\r\n'
    );

    const client: WsClient = {
      userId,
      send: (data: string) => {
        try {
          socket.write(data);
        } catch {
          // Socket closed
        }
      },
      close: () => socket.destroy(),
    };

    wsGateway.registerClient(userId, client);

    socket.on('close', () => {
      wsGateway.unregisterClient(userId, client);
    });

    socket.on('error', () => {
      wsGateway.unregisterClient(userId, client);
    });
  } catch {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
  }
});

if (process.env.NODE_ENV !== 'test') {
  seedDevelopmentData();

  const startServer = (port: number) => {
    const onError = (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`Port ${port} is in use, trying port ${port + 1}...`);
        server.removeListener('error', onError);
        startServer(port + 1);
      } else {
        console.error('Server error:', err);
      }
    };

    server.once('error', onError);
    server.listen(port, () => {
      server.removeListener('error', onError);
      console.log(`Flatmate Modular Monolith API listening on port ${port} [${env.NODE_ENV}]`);
      console.log(`📱 Real Flatmate User App:      http://localhost:${port}/`);
      console.log(`⚡ Developer API Test Console:  http://localhost:${port}/test-console`);
      console.log(`💬 Real-Time WebSocket Gateway: ws://localhost:${port}/ws`);
    });
  };

  startServer(env.PORT);
}

export { server };
