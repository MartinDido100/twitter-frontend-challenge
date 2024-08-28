import { useEffect } from "react";
import { useGetPaginatedPosts } from "../service/HttpRequestService";
import { setLength, updateFeed } from "../redux/user";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

export const useGetFeed = () => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.user.feed);
  const query = useAppSelector((state) => state.user.query);
  const limit = useAppSelector((state) => state.user.length);
  const {data,isLoading,isError} = useGetPaginatedPosts(limit,'',query)
  
  const handleFeedUpdate = async () => {
    dispatch(updateFeed(data));
    dispatch(setLength(data.length));
  }

  useEffect(() => {
    if(data === undefined) return;
    handleFeedUpdate()
  }, [query,data]);

  return { posts, loading: isLoading ,error: isError };
};
