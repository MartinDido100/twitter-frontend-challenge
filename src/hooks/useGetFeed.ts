import { useEffect } from "react";
import { useGetPaginatedPosts } from "../service/HttpRequestService";
import { setLength, updateFeed } from "../redux/user";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { LIMIT } from "../util/Constants";

export const useGetFeed = () => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.user.feed);
  const query = useAppSelector((state) => state.user.query);
  const after = useAppSelector((state) => state.user.lastPost);
  const length = useAppSelector((state) => state.user.length);

  const {data,isLoading,isError} = useGetPaginatedPosts(LIMIT,after,query)
  const handleFeedUpdate = () => {
    if(data.length === length){
      dispatch(updateFeed(data));
      dispatch(setLength(data.length));
    }else{
      const newFeed = posts.concat(data);
      dispatch(updateFeed(newFeed));
      dispatch(setLength(newFeed.length));
    }
  }

  useEffect(() => {
    if(data === undefined) return;
    handleFeedUpdate()
  }, [data]);

  return { posts, loading: isLoading ,error: isError };
};
