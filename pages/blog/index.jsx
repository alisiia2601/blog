import Heading from '@components/heading';
import Link from 'next/link';
import styles from './blog.module.css';
import useSWR from 'swr';
import { postCacheKey, getPosts } from '@/api-routes/posts';
import { useUser } from '@supabase/auth-helpers-react';

export default function Blog() {
  const { data: { data = [] } = {} } = useSWR(postCacheKey, getPosts);


  const user = useUser();
  console.log(user);

  return (
    <section>
      <Heading>Blog</Heading>
      {data?.map((post) => (
        <Link
          key={post.slug}
          className={styles.link}
          href={`/blog/${post.slug}`}
        >
          <div className='w-full flex flex-col'>
            <p>{post.title}</p>
            <time className={styles.date}>

            </time>
          </div>
        </Link>
      ))}
    </section>
  );
}