import app from './app.js';
import { connectDB } from './config/db.js';
import { logger } from './logger/logger.js';
import { printBanner } from './utils/consoleLog.js';

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    printBanner("✅ Server Started", `🌐 Listening at: http://localhost:${PORT}`);
  });
});
