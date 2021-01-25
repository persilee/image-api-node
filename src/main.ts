import app from './app';
import http from 'http';
import { APP_PORT } from './app/app.config';
import { connection } from './app/database/mysql';
import { createTerminus } from '@godaddy/terminus';

const server = http.createServer(app);

createTerminus(server);

app.listen(APP_PORT, () => {
  console.log('😜 应用已启动');
});

connection.connect((e) => {
  if (e) {
    console.log('error 😳');
    return;
  }

  console.log('😋 数据库连接成功');
});
