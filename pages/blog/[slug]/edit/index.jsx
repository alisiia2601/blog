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

