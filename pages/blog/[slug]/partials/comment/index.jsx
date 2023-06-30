import Button from "@components/button";
import { commentsCacheKey, deleteComment } from "@/api-routes/comments";
import { addReply, getReplies, deleteReply, replyCacheKey } from "@/api-routes/replies";
import { useRef } from "react";
import useSWRMutation from "swr/mutation"
import useSWR from "swr";
import Input from "@components/input";
import Label from "@components/label";

export default function Comment({ comment, createdAt, author, id: commentId }) {

  const formRef = useRef();

  const { data: { data = [] } = {}, error } = useSWR( commentId ? `${replyCacheKey}/${commentId}` : null, () => getReplies(commentId));

  const { trigger: deleteCommentTrigger } = useSWRMutation(commentsCacheKey, () => deleteComment(commentId), {
    onError: (error) => {
      console.log(error);
    }
  });
  

  const { trigger: addReplyTrigger } = useSWRMutation(`${replyCacheKey}/${commentId}`, addReply, {
    onError: (error) => {
      console.log(error)
    }
  })

  const { trigger: deleteReplyTrigger } = useSWRMutation( `${replyCacheKey}/${commentId}`, deleteReply, {
    onError: (error) => {
      console.log(error)
    }
  })

  const handleDeleteComment = async () => {
    const { data, error } = await deleteCommentTrigger(commentId)
  };

  const handleAddReply = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const { replyText } = Object.fromEntries(formData);
    const newReply = {
      reply: replyText,
      comment_id: commentId,
    }

    const { status, data, error } = await addReplyTrigger(newReply)
    
    formRef.current.reset();
  };

  const handledeleteReply = async (replyId) => {
    const { data, error } = await deleteReplyTrigger(replyId)
  }

  return (
    <div className='w-2/'>
      <p>{comment}</p>
      <p className='text-accentPurple font-bold'>- {author}</p>
      <time>{createdAt}</time>

      {data?.map((reply) => (
        <div key={reply.id}>
          <p>| {reply.reply}</p>
          <button onClick={() => handledeleteReply(reply.id)} className="font-light pb-2 text-lightColor ">Remove reply</button>
        </div>
      ))}

      <form ref={formRef} onSubmit={handleAddReply}>
        <div className='flex flex-col'>
          <Button onClick={handleDeleteComment}>Delete</Button>
          <Label htmlFor="replyText">Reply</Label>
          <Input id="replyText" name="replyText"/>
          <Button type="submit">Send</Button>
        </div>
      </form>
    </div>
  );
}