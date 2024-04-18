import express from 'express';
import cors from 'cors';
import http from 'http';
import { Sequelize } from 'sequelize';
import { DB } from './database';
import { router } from './routes/Router';
import { initData } from './database/dummy';

const stopServer = async (
  server: http.Server,
  sequelize: Sequelize,
  signal?: string
) => {
  server.close();
  await sequelize.close();
  process.exit();
};

const runServer = async (): Promise<void> => {
  const PORT = process.env.PORT || 8082;
  const app = express();
  const sequelize = DB.init();

  app.use(
    cors({
      credentials: true,
      origin: 'http://localhost:8080',
    })
  );

  app.use('/api', router);
  const server = app.listen(PORT, () => {
    console.log(`Starting server ${PORT}`);
  });
  try {
    await sequelize.authenticate();
    await sequelize.sync({
      force: process.env.SERVER === 'reset',
    });
    if (process.env.SERVER === 'reset') await initData();
  } catch (e) {
    stopServer(server, sequelize);
    throw e;
  }
};

runServer()
  .then(() => {
    console.log('run successfully');
  })
  .catch((ex: Error) => {
    console.log('Unable run:', ex);
  });
