import { APP_URL } from '../app/app.config';

export const sqlFragment = {
  user: `
    JSON_OBJECT(
      'id', user.id,
      'name', user.name,
      'avatar', CAST(
        IF(COUNT(avatar.id), 
          GROUP_CONCAT(
            DISTINCT JSON_OBJECT(
              'largeAvatarUrl', concat('${APP_URL}/avatar/', user.id, '|@u003f|size=large'),
              'mediumAvatarUrl', concat('${APP_URL}/avatar/', user.id, '|@u003f|size=medium'),
              'smallAvatarUrl', concat('${APP_URL}/avatar/', user.id, '|@u003f|size=small')
            )
          ),
        NULL)
      AS JSON)
    ) as user
  `,
  leftJoinUser: `
    LEFT JOIN user 
      ON user.id = post.userId
    LEFT JOIN avatar
      ON avatar.userId = user.id
  `,
  totalComments: `
    (
      SELECT COUNT(comment.id) FROM comment
      WHERE comment.postId = post.id
      GROUP BY comment.postId
	  ) as totalComments
  `,
  leftJoinOneFile: `
    LEFT JOIN LATERAL (
      SELECT * FROM file
      WHERE file.postId = post.id
      ORDER BY file.id DESC
      LIMIT 2
    ) AS file ON file.postId = post.id
  `,
  file: `
    CAST(
      IF(
        COUNT(file.id),
        CONCAT(
          '[',
            GROUP_CONCAT(
              DISTINCT JSON_OBJECT(
                'id', file.id,
                'width', file.width,
                'height', file.height,
                'largeImageUrl', concat('${APP_URL}/files/', file.id, '/serve|@u003f|size=large'),
                'mediumImageUrl', concat('${APP_URL}/files/', file.id, '/serve|@u003f|size=medium'),
                'thumbnailImageUrl', concat('${APP_URL}/files/', file.id, '/serve|@u003f|size=thumbnail')
              ) ORDER BY file.id DESC
            ),
          ']'
        ),
        NULL
      ) AS JSON
    ) AS files
  `,
  leftJoinTag: `
    LEFT JOIN post_tag
    ON post_tag.postId = post.id
    LEFT JOIN tag
    ON tag.id = post_tag.tagId
  `,
  tags: `
    CAST(
      IF(
        COUNT(tag.id),
        CONCAT(
          '[', 
            GROUP_CONCAT(
              DISTINCT JSON_OBJECT(
                'id', tag.id,
                'name', tag.name
              )
            ),
          ']'
        ),
        NULL
      ) AS JSON
    ) AS tags
  `,
  totalLikes: `
    (
      SELECT COUNT(user_like_post.postId)
      FROM user_like_post
      WHERE user_like_post.postId = post.id
    ) AS totalLikes
  `,
  innerJoinUserLikePost: `
    INNER JOIN user_like_post
    ON user_like_post.postId = post.id
  `,
  liked: `
    (
      SELECT COUNT(user_like_post.postId)
      FROM user_like_post
      WHERE user_like_post.userId = ? AND user_like_post.postId = post.id
    ) AS liked
  `,
  leftJoinCategory: `
    LEFT JOIN category 
    ON post.categoryId = category.id
  `,
};
