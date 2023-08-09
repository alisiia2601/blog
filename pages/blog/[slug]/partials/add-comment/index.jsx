import { useRef } from "react";
import Button from "@components/button";
import Input from "@components/input";
import Label from "@components/label";
import TextArea from "@components/text-area";
import {
  addComment,
  commentsCacheKey,
} from '../../../../../api-routes/comments';
import useSWRMutation from 'swr/mutation';

export default function AddComment({ postId }) {
  const formRef = useRef();
  const { trigger: addTrigger, isMutating } = useSWRMutation(
    commentsCacheKey,
    addComment,
    {
      onError: (error) => {
        console.log(error);
      },
    }
  );

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { author, comment } = Object.fromEntries(formData);
    const newComment = {
      author,
      comment,
      post_id: postId,
    };
console.log(newComment);
    try {
      const { status, error } = await addTrigger(newComment);
      if (!error) {
        formRef.current.reset(); 
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="w-full p-4">
      <h2 className="text-accentGreen font-semibold">Add a comment</h2>
      <form ref={formRef} onSubmit={handleOnSubmit}>
        <div className="flex flex-col">
          <Label htmlFor="author">Author</Label>
          <Input id="author" name="author" />
        </div>

        <div className="flex flex-col">
          <Label htmlFor="comment">Comment</Label>
          <TextArea id="comment" name="comment" className="bg-lightColor" />
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
