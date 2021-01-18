import app from './app';
import { APP_PORT } from './app/app.config';
import { connection } from './app/database/mysql';

app.listen(APP_PORT, () => {
  console.log('😜 应用已启动');
});

connection.connect((e) => {
  if (e) {
    console.log('error 😳');
    return;
  }

  console.log('success 😋');
});
