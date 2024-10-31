import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { WebSocket } from 'ws'; // Use WebSocket for the client connection

@WebSocketGateway()
export class TradeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server; // Use WebSocketServer to declare the server for handling client connections

  private poloniexWs: WebSocket; // Declare a WebSocket client instance

  afterInit() {
    // Initialize the WebSocket client to connect to Poloniex
    this.poloniexWs = new WebSocket('wss://api.poloniex.com');

    this.poloniexWs.on('open', () => {
      // Send subscription message to Poloniex
      this.poloniexWs.send(JSON.stringify({
        command: 'subscribe',
        channel: 'BTC_USDT',
      }));
    });

    this.poloniexWs.on('message', (data) => {
      // Emit the trade data to connected WebSocket clients
      this.server.emit('trade', data);
    });
  }

  handleConnection(client: any) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
  }
}
