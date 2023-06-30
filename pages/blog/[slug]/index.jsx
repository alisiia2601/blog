import { useRouter } from 'next/router';
import Comments from './partials/comments';
import AddComment from './partials/add-comment';
import Button from '@components/button';
import Heading from '@components/heading';
import BlogImageBanner from '@components/blog-image-banner';
import useSWRMutation from 'swr/mutation';
import useSWR from 'swr';
import { removePost, getPost, postsCacheKey } from '../../../api-routes/posts';
import { useUser } from '@supabase/auth-helpers-react';

export default function BlogPost() {
  const router = useRouter();
  const user = useUser();
  const { slug } = router.query;

  const { data: { data = [] } = {}, error } = useSWR(
    slug ? `${postsCacheKey}${slug}` : null,
    () => getPost({ slug })
  );

  const { trigger: deleteTrigger, isMutating } = useSWRMutation(
    postsCacheKey,
    removePost,
    {
      onError: (error) => {
        console.log(error);
      },
    }
  );

  const handleDeletePost = async () => {
    const postId = data.id;
    const { status, error } = await deleteTrigger(postId);

    if (!error) {
      router.push(`/blog`);
    }
  };

  const handleEditPost = () => {
    router.push(`/blog/${slug}/edit`);
  };

  return (
    <>
      <section className="p-4 max-w-7xl m-auto">
        <Heading>{data.title}</Heading>
        {data?.image && <BlogImageBanner src={data.image} alt={data.title} />}
        <div className='mb-4'>
          <time className="text-accentPurple">{data.created_at}</time>
        </div>
        <div dangerouslySetInnerHTML={{ __html: data.body }} />
        <span className='text-xl py-4'>Author: {data?.Users?.alias ?? 'Author'}</span>

        {user && (
          <div className="flex text-lightColor mt-2">
            <Button onClick={() => handleDeletePost(data.id)} className="mr-2">
              Delete
            </Button>
            <Button onClick={handleEditPost}>Edit</Button>
          </div>
        )}
      </section>

      {user && (
        <>
          <AddComment postId={data.id} />
          <Comments postId={data.id} />
        </>
      )}
    </>
  );
}