import { createServer } from 'http';
import app from './server/app';
import { initWebSocket } from './server/websocket';
import { logger } from './server/logger';

const port = Number(process.env.PORT || 4000);
const server = createServer(app);

initWebSocket(server);

server.listen(port, () => {
  logger.info(`API listening on http://localhost:${port}`);
});
