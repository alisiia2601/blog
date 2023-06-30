import Button from '@components/button';
import styles from '../../comment/comment.module.css';
import useSWRMutation from 'swr/mutation';
import { deleteReply, repliesCacheKey } from '@/api-routes/replies';

export default function Reply({
  author,
  created_at,
  handleDelete,
  id,
  postAuthorId,
  reply,
}) {
  const { trigger: replyDeleteTrigger, isMutating } = useSWRMutation(
    repliesCacheKey,
    deleteReply
  );

  return (
    <div className={styles.container}>
      <p>{reply}</p>
      <p className={styles.author}>{author}</p>
      <time className={styles.date}>{manipulateDate(created_at)}</time>
      <div className={styles.buttonContainer}>
        {isAuthorLogedIn({ postAuthor: postAuthorId }) && (
          <Button onClick={() => handleDelete(id, replyDeleteTrigger)}>
            {isMutating ? 'Deleting...' : 'Delete'}
          </Button>
        )}
      </div>
    </div>
  );
}