import http from 'http';
import { WebSocketServer } from 'ws';
import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Create HTTP Server
const server = http.createServer(app);

// Create WebSocket Server stub for future voice streaming (Bhashini/STT)
const wss = new WebSocketServer({ server, path: '/ws/audio' });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection for audio streaming');
  
  ws.on('message', (message) => {
    // In future: proxy blob to ML service and return text
    console.log('Received audio chunk buffer');
  });

  ws.on('close', () => {
    console.log('Audio WebSocket closed');
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Kisan Connect Gateway running on http://localhost:${PORT}`);
});
