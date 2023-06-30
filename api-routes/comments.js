import { supabase } from '../lib/supabaseClient';
export const commentsCacheKey = '/api/comments';

export const getComments = async (postId) => {
  const { data, error, status } = await supabase
    .from('comments')
    .select()
    .eq('post_id', postId);

  return { data, error, status };
};

export const addComment = async (_, { arg: newComment }) => {
  const { data, error, status } = await supabase
    .from('comments')
    .insert(newComment)
    .single()
    .eq('post_id', newComment.postId);

  return { data, error, status };
};

export const deleteComment = async (_, { id }) => {
  const { data, error, status } = await supabase
    .from('comments')
    .delete()
    .eq('id', id);

  return { data, error, status };
};

