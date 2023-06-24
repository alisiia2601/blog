import { supabase } from "../lib/supabaseClient";
export const postsCacheKey = '/api/posts'

export const getPosts = async () => {
  const { data, error, status } = await supabase.from('posts').select();

  return {data, error, status};
};

export const getPost = async ({ slug }) => {
  const { data, error, status } = await supabase
  .from('posts')
  .select(`*,users (alias)`)
  .single()
  .eq('slug', slug)

  return {error, status, data};
}

export const addPost = () => {
  //Handle add post here
};

export const removePost = () => {
  //Handle remove post here
};

export const editPost = () => {
  //Handle edit post here
};
