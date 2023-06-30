import Button from '@components/button';
import Input from '@components/input';
import Label from '@components/label';
import TextArea from '@components/text-area';
import styles from '../../add-comment/add-comment.module.css';
import useSWRMutation from 'swr/mutation';
import { repliesCacheKey, addReply } from '@/api-routes/replies';
import { useRef } from 'react';

export default function AddReply({ commentId, reply, setReply }) {
  const formRef = useRef(); // create a reference

  const { trigger: addReplyTrigger, isMutating } = useSWRMutation(
    commentId ? `${repliesCacheKey}${commentId}` : null,
    addReply
  );

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { author, comment } = Object.fromEntries(formData);

    //PUSH to posts comment to database
    console.log({ author, comment, commentId });
    const { error, status } = await addReplyTrigger({
      author,
      reply: comment,
      comment_id: commentId,
    });

    if (error || status !== 201) {
      console.log({ status, error });
      return;
    }

    formRef.current.reset();
    setReply(!reply);
  };

  return (
    <div className={styles.container}>
      <h2>Add a reply</h2>
      <form ref={formRef} className={styles.form} onSubmit={handleOnSubmit}>
        <div className={styles.inputContainer}>
          <Label htmlFor='author'>Author</Label>
          <Input id='author' name='author' />
        </div>

        <div className={styles.inputContainer}>
          <Label htmlFor='comment'>Comment</Label>
          <TextArea id='comment' name='comment' />
        </div>

        <Button className={styles.addCommentButton} type='submit'>
          {isMutating ? 'Submiting...' : 'Submit'}
        </Button>
      </form>
    </div>
  );
}