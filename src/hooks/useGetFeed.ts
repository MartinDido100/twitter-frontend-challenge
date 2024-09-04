import { useEffect } from "react";
import { useGetPaginatedPosts } from "../service/HttpRequestService";
import { concatToFeed, setLength, updateFeed } from "../redux/user";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { LIMIT } from "../util/Constants";

export const useGetFeed = () => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.user.feed);
  const query = useAppSelector((state) => state.user.query);
  const after = useAppSelector((state) => state.user.lastPost);
  const {data,isLoading,isError} = useGetPaginatedPosts(LIMIT,after,query);

  const handleDataUpdate = () => {
    if (data.length > 0) {
      if (after) {
        dispatch(concatToFeed(data));
      } else {
        dispatch(updateFeed(data));
      }
      dispatch(setLength(data.length));
    }
  }

  useEffect(() => {
    if(data === undefined) return;
    handleDataUpdate();
  }, [data]);

  return { posts, loading: isLoading, error: isError };
};
