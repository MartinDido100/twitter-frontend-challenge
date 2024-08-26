import { useEffect, useState } from "react";
import { useGetPostsFromProfile } from '../service/HttpRequestService';
import { updateFeed } from "../redux/user";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

export const useGetProfilePosts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const posts = useAppSelector((state) => state.user.feed);
  const dispatch = useAppDispatch();
  const id = useParams().id;
  const {fetchProfilePosts} = useGetPostsFromProfile(id!)

  const handleFeedUpdate = async () => {
    setLoading(true);
    setError(false);
    const {data,error} = await fetchProfilePosts()
    if(error) setError(true)
    const updatedPosts = Array.from(new Set([...posts, ...data])).filter(
      (post) => post.authorId === id
    );
    dispatch(updateFeed(updatedPosts));
    setLoading(false);
  }

  useEffect(() => {
    if (!id) return;
    handleFeedUpdate()
  }, [id]);

  return { posts, loading, error };
};
