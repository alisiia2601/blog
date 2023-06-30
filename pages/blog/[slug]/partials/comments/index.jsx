import Comment from '../comment';
import styles from './comments.module.css';
import useSWR from 'swr';
import { commentsCacheKey, getComments } from '@/api-routes/comments';

export default function Comments({ postId, postAuthorId }) {
  //GET post comments
  const {
    data: { data = [] } = {},
    error,
    status,
  } = useSWR(postId ? `${commentsCacheKey}${postId}` : null, () =>
    getComments(postId)
  );

  return (
    <div className={styles.container}>
      <h2>Comments</h2>
      {data?.map((comment) => (
        <Comment key={comment.id} {...comment} postAuthorId={postAuthorId} />
      ))}
      {!data.length && <p>No comments</p>}
    </div>
  );
}