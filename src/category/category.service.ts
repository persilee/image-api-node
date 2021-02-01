import { connection } from '../app/database/mysql';

/**
 * 查询分类列表
 */
export const selectCategory = async () => {
  const sql = `
    SELECT name FROM category
  `;
  const [data] = await connection.promise().query(sql);

  return data;
};
