import { useEffect } from "react";
import { useGetCommentsByPost } from "../service/HttpRequestService";
import { setLength, updateFeed } from "../redux/user";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

interface UseGetCommentsProps {
  postId: string;
}

export const useGetComments = ({ postId }: UseGetCommentsProps) => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.user.feed);
  const {data,isLoading: loading,error} = useGetCommentsByPost(postId)

  const handleFeedUpdate = () => {
      dispatch(updateFeed(data));
      dispatch(setLength(data.length));
  }

  useEffect(() => {
    if(data === undefined) return;
    handleFeedUpdate()
  }, [data,postId]);

  return { posts, loading, error };
};
