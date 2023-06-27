import Button from "@components/button";
import styles from "./comment.module.css";
import useSWRMutation from "swr/mutation"; 
import useSWR from "swr";
import Input from "@components/input";
import Label from "@components/label";
import { removeComment, commentCacheKey } from "../../../../../api-routes/comments";
import { getReplies, replyCacheKey, addReply, removeReply } from "../../../../../api-routes/replies";
import { useRef, useState } from "react";

export default function Comment({ comment, createdAt, author, id, postId }) {
  const [replyText, setReplyText] = useState("");

  const formRef = useRef();

  const { data: { data = [] } = {}, error } = useSWR(
    id ? `${replyCacheKey}/${id}` : null, () =>
    getReplies(id)
  );

  const { trigger: deleteCommentTrigger } = useSWRMutation(
    postId ? 
    `${commentCacheKey}${postId}` 
    : null, removeComment, {
      onError: (error) => {
        console.log(error)
      }
    })

    const { trigger: addReplyTrigger } = useSWRMutation (
      `${replyCacheKey}/${id}`,
      addReply, {
        onError: (error) => {
          console.log(error)
        }
      })

      const { trigger: removeReplyTrigger } = useSWRMutation (
        `${replyCacheKey}/${id}`,
        removeReply, {
          onError: (error) => {
            console.log(error)
          }
        })

  const handleDelete = async () => {
    const postId = id 
    const { status, error } = await deleteCommentTrigger(postId)
    console.log({ id });
  };

  const handleAddReply = async (event) =>{
    event.preventDefault();

    const formData = new FormData(event.target);
    const { reply } = Object.fromEntries(formData)

    const newReply = {
      reply,
      comment_id: id,
    }

    const { data, status, error } = await addReplyTrigger(newReply)
    console.log( data, error ); 

    if (status === 201) {
      setReplyText(""); 
    }
    console.log(status)
  };

  const handleRemoveReply = async (replyId) => {
    console.log({ replyId })

    const { data, error } = await removeReplyTrigger(replyId)
    console.log(replyId)
  }

  return (
    <div className={styles.container}>
      <p>{comment}</p>
      <p className={styles.author}>{author}</p>
      <time className={styles.date}>{createdAt}</time>

      {data.map((reply) => (
        <div key={reply.id}>
          <p className={styles.replyText}>| {reply.reply}</p>
          <button className={styles.removeReplyButton} onClick={() => handleRemoveReply(reply.id)}>Remove reply</button>
        </div>
      ))}
      
      <form ref={formRef} onSubmit={handleAddReply}>
        <div className={styles.buttonContainer}>
          <Button onClick={handleDelete}>Delete</Button>
          <Label htmlFor="reply">Reply</Label>
          <Input 
          id="reply" 
          name="reply"
          value={replyText}
          onChange={(event) => setReplyText(event.target.value)}
           />
          <Button type="submit">Send</Button>
        </div>
      </form>
    </div>
      );
    }
