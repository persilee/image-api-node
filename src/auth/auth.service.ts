import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../app/app.config';
import { connection } from '../app/database/mysql';

interface SignTokenOptions {
  payload?: any;
}

export const signToken = (options: SignTokenOptions) => {
  const { payload } = options;
  const token = jwt.sign(payload, PRIVATE_KEY, { algorithm: 'RS256' });
  return token;
};

interface PossessOptions {
  resourceId: number;
  resourceType: string;
  userId: number;
}

export const possess = async (options: PossessOptions) => {
  const { resourceId, resourceType, userId } = options;

  const sql = `
    SELECT COUNT(${resourceType}.id) as count 
    FROM ${resourceType}
    WHERE ${resourceType}.id = ? AND userId = ?
  `;
  const [data] = await connection.promise().query(sql, [resourceId, userId]);

  return data[0].count ? true : false;
};
