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
 * 查找用户
 * @param name
 */
export const getUser = (condition: string) => {
  return async (param: string | number, options: GetUserOptions = {}) => {
    const { password } = options;
    const sql = `
      SELECT 
        user.id,
        user.name,
        IF (
          COUNT(avatar.id), 1, NULL
        ) AS avatar
        ${password ? ', password' : ''}
      FROM
        user
      LEFT JOIN avatar
        ON avatar.userId = user.id
      WHERE 
        ${condition} = ?
    `;

    const [data] = await connection.promise().query(sql, param);

    console.log(data[0]);

    return data[0].id ? data[0] : null;
  };
};

/**
 * 根据名字查找用户
 */
export const getUserByName = getUser('user.name');

/**
 * 根据id查找用户
 */
export const getUserById = getUser('user.id');

/**
 * 更新用户
 */
export const updateUser = async (userId: number, userData: UserModel) => {
  const sql = `
    UPDATE user
    SET ?
    WHERE user.id = ?
  `;
  const [data] = await connection.promise().query(sql, [userData, userId]);

  return data;
};
