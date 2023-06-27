import AddComment from './partials/add-comment';
import BlogImageBanner from '@components/blog-image-banner';
import Button from '@components/button';
import Comments from './partials/comments';
import Heading from '@components/heading';
import styles from './blog-post.module.css';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { isAuthorLogedIn } from '@/utils/isAuthorLogedIn';
import { manipulateDate } from '@/utils/manipulateDate';
import { postCacheKey, getPost, removePost } from '@/api-routes/posts';
import { useRouter } from 'next/router';

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;

  const {
    data: { data = [] } = {},
    error,
    status,
  } = useSWR(slug ? `${postCacheKey}${slug}` : null, () => getPost({ slug }));

  const { trigger: deleteTrigger } = useSWRMutation(postCacheKey, removePost);

  const handleDeletePost = async (id) => {
    const { error, status } = await deleteTrigger(id);

    if (error || status !== 204) {
      console.log({ status, error });
      return;
    }

    router.push('/blog');
  };

  const handleEditPost = () => {
    router.push(`/blog/${slug}/edit`);
  };

  return (
    <>
      <section className={styles.container}>
        <Heading>{data.title}</Heading>
        {data?.image && <BlogImageBanner src={data.image} alt={data.title} />}
        <div className={styles.dateContainer}>
          <time className={styles.date}>{manipulateDate(data.created_at)}</time>
          <div className={styles.border} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: data.body }} />
        <span className={styles.author}>Author: {data.author}</span>

        {isAuthorLogedIn({ postAuthor: data.user_id }) && (
          <div className={styles.buttonContainer}>
            <Button onClick={() => handleDeletePost(data.id)}>Delete</Button>
            <Button onClick={handleEditPost}>Edit</Button>
          </div>
        )}
      </section>

      <Comments postId={data.id} postAuthorId={data.user_id} />

      <AddComment postId={data.id} />
    </>
  );
}