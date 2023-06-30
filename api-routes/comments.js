import supabase from '@/lib/supabaseClient';

export const commentsCacheKey = '/api/comments';

//GET all comments
export const getComments = async (post_id) => {
  const { data, error, status } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', post_id);

  return { data, error, status };
};

//POST comment
export const addComment = async (_, { arg: comment }) => {
  const { error, status } = await supabase
    .from('comments')
    .insert({ ...comment });

  return { error, status };
};

//DELETE comment
export const removeComment = async (_, { arg: id }) => {
  const { error, status } = await supabase
    .from('comments')
    .delete()
    .eq('id', id);

  return { error, status };
};