import Link from "next/link";
import styles from "./blog.module.css";
import Heading from "@components/heading";
import { getPosts, postsCacheKey } from "../../api-routes/posts";
import useSWR from 'swr'
import { useUser } from "@supabase/auth-helpers-react";

export default function Blog() {
  const user = useUser()

  const {data: {data = []} = {}, error} = useSWR(postsCacheKey, getPosts);
  return (
    <section className="w-full">
      <Heading>Blog</Heading>
      {data?.map((post) => (
        <Link
          key={post.slug}
          className={styles.link}
          href={`/blog/${post.slug}`}
        >
          <div className="w-full flex flex-col">
            <p>{post.title}</p>
            <time className={styles.date}>{post.createdAt}</time>
          </div>
        </Link>
      ))}
    </section>
  );
}
