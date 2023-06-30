import Link from "next/link";
import Heading from "@components/heading";
import { getPosts, postsCacheKey } from "../../api-routes/posts";
import useSWR from 'swr'
import { useUser } from "@supabase/auth-helpers-react";

export default function Blog() {  
  const user = useUser()

  const {
    data: {data = []} = {}, 
    error
  } = useSWR(postsCacheKey, getPosts)

  return (
    <section className="w-full  text-darkColor md:p12 p-2">
      <div className="border-2 border-black bg-lightColor">
        <div className="flex">
          <h1 className="text-4xl text-darkColor py-4 px-2 text-left">Blog</h1>
        </div>
        {data?.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <div className="w-full flex flex-col border-t-2 border-black">
              <p className="font-semibold px-2">{post.title}</p>
              <time className="text-sm text-accentPurple px-2 pb-2">
                {post.created_at.slice(0, 16)}
              </time>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}