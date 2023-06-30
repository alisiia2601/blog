import { supabase } from '@/lib/supabaseClient';
import { uploadImage } from '@/utils/uploadImage';

export const postsCacheKey = '/api/posts';

//GET all posts
export const getPosts = async () => {
  const { data, error, status } = await supabase.from('posts').select('*');

  return { data, error, status };
};

//GET sepcific post
export const getPost = async ({ slug }) => {
  const { data, error, status } = await supabase
    .from('posts')
    .select('*')
    .single()
    .eq('slug', slug);

  return { data, error, status };
};

//POST a new post
export const addPost = async (_, { arg: newPost }) => {
  let image = '';

  if (newPost?.image) {
    const { publicUrl, error } = await uploadImage(newPost?.image);

    if (!error) {
      image = publicUrl;
    }
  }

  //console.log({ image }, image);

  const { error, status } = await supabase
    .from('posts')
    .insert({ ...newPost, image })
    .select()
    .single();

  return { error, status };
};

//DELETE a post
export const removePost = async (_, { arg: id }) => {
  const { error, status } = await supabase.from('posts').delete().eq('id', id);

  return { error, status };
};

//PUT edits into a post
export const editPost = async (_, { arg: updatedPost }) => {
  let image = updatedPost?.image ?? '';

  const isNewImage = typeof image === 'object' && image !== null;

  if (isNewImage) {
    const { publicUrl, error } = await uploadImage(updatedPost?.image);

    if (!error) {
      image = publicUrl;
    }
  }

  const { error, status } = await supabase
    .from('posts')
    .update({ ...updatedPost, image })
    .eq('id', updatedPost.id)
    .select()
    .single();

  return { error, status };
};

export const searchPosts = async (title) => {
  const { data, error } = await supabase
    .from('posts')
    .select()
    .ilike('title', `%${title}%`);

  return { data, error };
};