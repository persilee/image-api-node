import { APP_URL } from '../app/app.config';

export const sqlFragment = {
  leftJoinUser: `
    LEFT JOIN user
      ON user.id = comment.userId
    LEFT JOIN avatar
      ON user.id = avatar.userId
  `,
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
          GROUP_CONCAT(
            DISTINCT JSON_OBJECT(
              'largeAvatarUrl', 'https://cdn.lishaoy.net/links/notes1.png',
              'mediumAvatarUrl', 'https://cdn.lishaoy.net/links/notes1.png',
              'smallAvatarUrl', 'https://cdn.lishaoy.net/links/notes1.png'
            )
          )
        )
      AS JSON)
    ) as user
  `,
  leftJoinPost: `
    LEFT JOIN post
      ON post.id = comment.postId
  `,
  post: `
    JSON_OBJECT(
      'id', post.id,
      'title', post.title
    ) AS postInfo
  `,
  repliedComment: `
    (
      SELECT 
        JSON_OBJECT(
          'id', repliedComment.id,
          'content', repliedComment.content
        )
      FROM comment repliedComment
      WHERE comment.parentId = repliedComment.id
    ) AS repliedComment
  `,
  totalReplies: `
    (
      SELECT 
        COUNT(reply.id)
      FROM comment reply
      WHERE
        reply.parentId = comment.id
    ) AS totalReplies
  `,
  leftJoinRepComment: `
    LEFT JOIN 
    (
      SELECT comment.content, comment.id, comment.userId, user.name  FROM comment 
      LEFT JOIN user ON user.id = comment.userId 
      WHERE comment.id in (SELECT parentId FROM comment WHERE comment.parentId IS NOT NULL) 
	  ) rep 
	  ON rep.id = comment.parentId
  `,
  repComment: `
    IF(rep.content IS NOT NULL, JSON_OBJECT(
      'content', rep.content,
      'userName', rep.name
    ), NULL) AS repComment
  `,
};
