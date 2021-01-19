import { connection } from '../app/database/mysql';
import { UserModel } from './user.model';

/**
 * 新增用户
 * @param user
 */
export const createUser = async (user: UserModel) => {
  const sql = `
    INSERT INTO user 
    SET ?
  `;
  const [data] = await connection.promise().query(sql, user);

  return data;
};

interface GetUserOptions {
  password?: boolean;
}

/**
 * 根据用户名查找用户
 * @param name
 */
export const getUserByName = async (
  name: string,
  options: GetUserOptions = {},
) => {
  const { password } = options;
  const sql = `
    SELECT 
      id, 
      name
      ${password ? ',password' : ''}
    FROM user
    WHERE name = ?
  `;
  const [data] = await connection.promise().query(sql, name);

  return data[0];
};
