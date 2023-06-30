import { useRouter } from "next/router";
import BlogEditor from "../../../../components/blog-editor";
import useSWRMutation from "swr/mutation"
import { editPost, postsCacheKey, getPost } from "../../../../api-routes/posts";
import useSWR from "swr";
import { createSlug } from "@/utils/createSlug";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

export default function EditBlogPost() {
  const router = useRouter();
  const { slug } = router.query;

  const { data: { data: post = {} } = {}, error, isLoading } = useSWR(slug ? `${postsCacheKey}${slug}` : null, () =>
    getPost({ slug })
  );

  const { trigger: editTrigger, isMutating } = useSWRMutation(postsCacheKey, editPost, {
    onError: (error) => {
      console.log(error)
    }
  })

  const handleOnSubmit = async ({ editorContent, titleInput, image }) => {
    const slug = createSlug(titleInput);
    const id = post.id

    const editedPost = {
      body: editorContent,
      title: titleInput,
      slug,
      id,
      image
    }
    const { data, error } = await editTrigger(editedPost)

    if (!error) {
      router.push(`/blog/${slug}`)
    } else {
      console.log(error)
    }
  };

  if(isLoading) {
    return "..loading"
  }

  return (
    <BlogEditor
      heading="Edit blog post"
      title={post.title}
      src={post.image}
      alt={post.title}
      content={post.body}
      buttonText="Save changes"
      onSubmit={handleOnSubmit}
    />
  );
}

export const getServerSideProps = async (ctx) => {
  const supabase = createPagesServerClient(ctx)

  const {slug} = ctx.params

  const { 
    data: { session } 
  } = await supabase.auth.getSession()

  const {data} = await supabase.from("posts").select().single().eq("slug", slug)

  console.log(session)

  const isAuthor = data.user_id === session.user.id;
  
  if (!isAuthor){
    return {
      redirect:{
        destination: `/blog/${slug}`,
        permanent: true,
      }
    }
  }

  return {
    props: {},
  }
}