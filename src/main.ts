import express from 'express';
import { Request, Response } from 'express';
const app = express();

app.listen(3000, () => {
	console.log('服务已启动');
});
