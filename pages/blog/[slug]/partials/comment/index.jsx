import Button from '@components/button';
import Reply from '../partials/reply';
import styles from './comment.module.css';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { commentsCacheKey, removeComment } from '@/api-routes/comments';
import { getReplies, repliesCacheKey } from '@/api-routes/replies';
import { useState } from 'react';

export default function Comment({
  author,
  comment,
  created_at,
  id,
  postAuthorId,
}) {
  const [reply, setReply] = useState(false);

  //GET post comments
  const {
    data: { data = [] } = {},
    error,
    status,
  } = useSWR(id ? `${repliesCacheKey}${id}` : null, () => getReplies(id));
  console.log({ data });
  console.log({ error, status });

  const { trigger: deleteTrigger, isMutating } = useSWRMutation(
    commentsCacheKey,
    removeComment
  );

  const handleDelete = async (id, trigger) => {
    const { error, status } = await trigger(id);

    if (error || status !== 204) {
      console.log({ status, error });
      return;
    }

    console.log(
      `${
        trigger === 'deleteTrigger' ? 'Comment' : 'Reply'
      } will be deleted, id: ${id}`
    );
  };

  const handleReply = () => {
    console.log('pressed reply button');
    setReply(!reply);
  };

  return (
    <>
      <div className={styles.container}>
        <p>{comment}</p>
        <p className={styles.author}>{author}</p>
        <time className={styles.date}>{manipulateDate(created_at)}</time>
        <div className={styles.buttonContainer}>
          {isAuthorLogedIn({ postAuthor: postAuthorId }) && (
            <Button onClick={() => handleDelete(id, deleteTrigger)}>
              {isMutating ? 'Deleting...' : 'Delete'}
            </Button>
          )}
          <Button onClick={handleReply}>{!reply ? 'Reply' : 'Exit'}</Button>
        </div>
      </div>
      {(data.length > 0 || reply) && (
        <div className={styles.repliesContainer}>
          {data.map((reply) => (
            <Reply
              key={reply.id}
              {...reply}
              postAuthorId={postAuthorId}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </>
  );
}