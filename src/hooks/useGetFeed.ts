import { useEffect, useState } from "react";
import { useGetPaginatedPosts } from "../service/HttpRequestService";
import { setLength, updateFeed } from "../redux/user";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

export const useGetFeed = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const posts = useAppSelector((state) => state.user.feed);
  const query = useAppSelector((state) => state.user.query);
  const limit = useAppSelector((state) => state.user.length);
  const {fetchPaginatedPosts} = useGetPaginatedPosts(limit,'',query)

  const dispatch = useAppDispatch();

  const handleFeedUpdate = async () => {
    try {
      setLoading(true);
      setError(false);
      const { data } = await fetchPaginatedPosts();
      const updatedPosts = Array.from(new Set([...posts, ...data]));
      dispatch(updateFeed(updatedPosts));
      dispatch(setLength(updatedPosts.length));
      setLoading(false);
    } catch (e) {
      setError(true);
    }
  }

  useEffect(() => {
    handleFeedUpdate()
  }, [query]);

  return { posts, loading, error };
};
