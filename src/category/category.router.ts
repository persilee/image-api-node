import express from 'express';
import * as categoryController from './category.controller';

const router = express.Router();

router.get('/category', categoryController.index);

export default router;
