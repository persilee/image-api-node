import { connection } from '../app/database/mysql';
import { UserModel } from './user.model';
import { APP_URL } from '../app/app.config';

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
        (SELECT COUNT(post.userId) FROM post WHERE post.userId = user.id) as totalPosts,
        CAST( 
        		IF(COUNT(avatar.id), 
		          GROUP_CONCAT(
		            DISTINCT JSON_OBJECT(
		              'largeAvatarUrl', concat('${APP_URL}/avatar/', user.id, '|@u003f|size=large'),
		              'mediumAvatarUrl', concat('${APP_URL}/avatar/', user.id, '|@u003f|size=medium'),
		              'smallAvatarUrl', concat('${APP_URL}/avatar/', user.id, '|@u003f|size=small')
		            )
		          ),
		          GROUP_CONCAT(
		            DISTINCT JSON_OBJECT(
		              'largeAvatarUrl', 'https://cdn.lishaoy.net/links/notes1.png',
		              'mediumAvatarUrl', 'https://cdn.lishaoy.net/links/notes1.png',
		              'smallAvatarUrl', 'https://cdn.lishaoy.net/links/notes1.png'
		            )
		          )
		        )
        	AS json) as avatar
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
