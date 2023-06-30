import supabase from '@/lib/supabaseClient';

export const repliesCacheKey = '/api/replies';

//GET all replies for a comment
export const getReplies = async (comment_id) => {
  const { data, error, status } = await supabase
    .from('replies')
    .select('*')
    .eq('comment_id', comment_id);

  return { data, error, status };
};

//POST reply
export const addReply = async (_, { arg: reply }) => {
  const { error, status } = await supabase.from('replies').insert({ ...reply });

  return { error, status };
};

//DELETE reply
export const deleteReply = async (_, { arg: id }) => {
  const { error, status } = await supabase
    .from('replies')
    .delete()
    .eq('id', id);

  return { error, status };
};