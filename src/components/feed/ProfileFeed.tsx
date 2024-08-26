import React from 'react';
import Feed from './Feed';
import { useGetProfilePosts } from '../../hooks/useGetProfilePosts';
import { StyledH5 } from '../common/text';

const ProfileFeed = () => {
  const { posts, loading } = useGetProfilePosts();

  return (
    <>{posts.length > 0 ? <Feed posts={posts} loading={loading} /> : <StyledH5>This user has no tweets</StyledH5>}</>
  );
};
export default ProfileFeed;
