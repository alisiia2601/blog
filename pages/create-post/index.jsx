import BlogEditor from "@/components/blog-editor";
import { createSlug } from "@/utils/createSlug";
import { addPost, postsCacheKey } from "../../api-routes/posts";
import { useRouter } from "next/router";
import useSWRMutation from 'swr/mutation';
import useSWR from 'swr';
import { useUser } from "@supabase/auth-helpers-react";


export default function CreatePost() {
   const router = useRouter();
   const user = useUser()
  
  const { trigger: addTrigger, isMutating } = useSWRMutation(postsCacheKey, addPost, {
    onError: (error) => {
      console.log(error);
    }
  });
 
  const handleOnSubmit = async ({ editorContent, titleInput, image }) => {
    const slug = createSlug(titleInput);
    
    const newPost = {
      title: titleInput,
      body: editorContent,
      slug,
      user_id: user.id,
      image,
    };
    
   const { status, error } = await addTrigger(newPost); 
    if (!error) {
      router.push(`/blog/${slug}`);
    }
     
  };

  return (
    <BlogEditor
      heading="Create post"
      onSubmit={handleOnSubmit}
      buttonText={
        isMutating ? 'Creating...' : 'Create Post'
      }  
    />
  );
}