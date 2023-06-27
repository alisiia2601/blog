import { useRouter } from "next/router";
import styles from "./comments.module.css";
import Comment from "../comment";
import { commentCacheKey, getComments } from '@/api-routes/comments'
import useSWR  from "swr"


export default function Comments({ postId }) {
  const router = useRouter();
  console.log({ postId})
  
  const { slug } = router.query;

  const { data : { data: post = []} = {},
  error,
 isLoading } = useSWR(
  postId ? 
  `${commentCacheKey}${postId}` 
  : null, () =>
 getComments({postId}) 
 );
 console.log(post)

  return (
    <div className={styles.container}>
      <h2>Comments</h2>
      {post.map((comment) => (
        <Comment key={comment.id} {...comment} postId={postId} />
      ))}
    </div>
  );
}