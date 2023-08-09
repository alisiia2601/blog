import { supabase } from "../lib/supabaseClient";
import { uploadImage } from "../utils/uploadImage";
export const postsCacheKey = '/api/posts'

export const getPosts = async () => {
  const { data, error, status } = await supabase
  .from('posts')
  .select()

  return {data}
};

export const getPost = async ({ slug }) => {
  const { data, error, status } = await supabase
  .from('posts')
  .select(`*`)
  .single()
  .eq('slug', slug)
console.log(data, error);
  return {data}
}

export const addPost = async (_, {arg: newPost}) => {
  const {slug, title, body } = newPost
  let image = ""
  if(newPost?.image) {
   const {publicUrl, error } = await uploadImage(newPost?.image)

   if(!error) {
    image = publicUrl;
   }
  }
  console.log(image)
  const { data, error } = await supabase
  .from('posts')
  .insert({...newPost, image})
  .select()
  .single();
  if (error) {
    console.log("Failed to add new data.");
  }
 
  return {data};
};

export const removePost = async (_, {arg: postId}) => {
  const { error, data } = await supabase
  .from('posts')
  .delete()
  .eq('id', postId)

  console.log(postId)
  if (error) {
    console.log("Failed to delete data.", error);
  }

  return {error, data}
};

export const editPost = async (_, { arg: editedPost }) => {
  let image = editedPost?.image ?? "";

  const isNewImage = typeof image === "object" && image !== null;

  if (isNewImage) {
    const { publicUrl, error } = await uploadImage(editedPost?.image);

    if (!error) {
      image = publicUrl;
    }
  }

  const { data, error, status } = await supabase
    .from("posts")
    .update({ ...editedPost, image })
    .select()
    .single()
    .eq("id", editedPost.id);

  return { error, status, data };

};