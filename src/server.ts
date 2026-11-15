import http from 'node:http';
import net from 'node:net';
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

  const getAvailablePort = (desiredPort: number): Promise<number> => {
    return new Promise((resolve) => {
      const tester = net.createServer();
      tester.listen(desiredPort, '0.0.0.0', () => {
        tester.close(() => resolve(desiredPort));
      });
      tester.on('error', () => {
        resolve(getAvailablePort(desiredPort + 1));
      });
    });
  };

  getAvailablePort(env.PORT).then((actualPort) => {
    server.listen(actualPort, '0.0.0.0', () => {
      console.log(`Flatmate Modular Monolith API listening on port ${actualPort} [${env.NODE_ENV}]`);
      console.log(`📱 Real Flatmate User App:      http://localhost:${actualPort}/`);
      console.log(`⚡ Developer API Test Console:  http://localhost:${actualPort}/test-console`);
      console.log(`💬 Real-Time WebSocket Gateway: ws://localhost:${actualPort}/ws`);
    });
  });
}

export { server };
