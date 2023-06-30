import { supabase } from '../lib/supabaseClient';
export const replyCacheKey = 'api/replies';

export const getReplies = async (commentId) => {
  const { data, error, status } = await supabase
    .from('replies')
    .select()
    .eq('comment_id', commentId);

  return { data, error, status };
};

export const addReply = async (_, { arg: newReply }) => {
  const { data, error, status } = await supabase
    .from('replies')
    .insert(newReply)
    .single()
    .eq('comment_id', newReply.commentId);

  return { data, error, status };
};

export const deleteReply = async (_, { arg: replyId }) => {
  const { data, error, status } = await supabase
    .from('replies')
    .delete(replyId)
    .single()
    .eq('id', replyId);

  return { data, error, status };
};