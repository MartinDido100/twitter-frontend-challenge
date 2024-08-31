import { useEffect } from "react";
import { useGetPaginatedPosts } from "../service/HttpRequestService";
import { setLength, updateFeed } from "../redux/user";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { LIMIT } from "../util/Constants";

export const useGetFeed = () => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.user.feed);
  const query = useAppSelector((state) => state.user.query);
  const {data,isLoading,isError} = useGetPaginatedPosts(LIMIT,'',query)

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
