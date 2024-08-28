import { useEffect } from "react";
import { useGetPostsFromProfile } from '../service/HttpRequestService';
import { updateFeed } from "../redux/user";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

export const useGetProfilePosts = () => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.user.feed)
  const id = useParams().id;
  const {data,isLoading,isError,isRefetching} = useGetPostsFromProfile(id!)

  const handleFeedUpdate = async () => {
    dispatch(updateFeed(data));
  }

  useEffect(() => {
    if(!id || data === undefined) return;
    handleFeedUpdate()
  }, [data,id]);

  return { posts, loading: isLoading,error: isError,isRefetching };
};
