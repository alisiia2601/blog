import { useRef } from "react";
import Button from "@components/button";
import Input from "@components/input";
import Label from "@components/label";
import TextArea from "@components/text-area";
import styles from "./add-comment.module.css";
import useSWRMutation from "swr/mutation";
import { addComment, commentCacheKey } from "../../../../../api-routes/comments";


export default function AddComment({ postId }) {
  const formRef = useRef(); 
  
  const { trigger: addCommentTrigger } = useSWRMutation(
    postId ? 
    `${commentCacheKey}${postId}` 
    : null, addComment, {
      onError: (error) => {
        console.log(error)
      }
    });

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const { author, comment } = Object.fromEntries(formData);
   
      const newComment = {
        author, 
        comment, 
        post_id: postId
      }

    console.log({newComment})
    console.log({ author, comment, postId });
    const { status, error } = await addCommentTrigger(newComment)
 
    formRef.current.reset();
  };

  return (
    <div className={styles.container}>
      <h2>Add a comment</h2>
      <form ref={formRef} className={styles.form} onSubmit={handleOnSubmit}>
        <div className={styles.inputContainer}>
          <Label htmlFor="author">Author</Label>
          <Input id="author" name="author" />
        </div>

        <div className={styles.inputContainer}>
          <Label htmlFor="comment">Comment</Label>
          <TextArea id="comment" name="comment" />
        </div>

        <Button className={styles.addCommentButton} type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}