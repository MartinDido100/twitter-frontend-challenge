import { Post } from '../../service';
import { StyledContainer, StyledFeedContainer } from '../common/Container';
import Tweet from '../tweet/Tweet';
import Loader from '../loader/Loader';
import { useEffect, useRef } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { LIMIT } from '../../util/Constants';
import { useQueryClient } from '@tanstack/react-query';
import { setLastPost } from '../../redux/user';

interface FeedProps {
  posts: Post[];
  loading: boolean;
}

const Feed = ({ posts, loading }: FeedProps) => {
  const lastElementRef = useRef<HTMLDivElement | null>(null);
  const length = useAppSelector((state) => state.user.length);
  const dispatch = useAppDispatch();

  const observer = useIntersectionObserver({
    cb: () => {
      if (length >= LIMIT) {
        dispatch(setLastPost(posts[posts.length - 1].id));
        window.scrollBy({
          top: -100,
          behavior: 'smooth',
        });
      }
    },
    loading,
  });

  useEffect(() => {
    if (lastElementRef.current) {
      observer.current?.observe(lastElementRef.current);
    }

    return () => {
      if (lastElementRef.current) {
        observer.current?.unobserve(lastElementRef.current);
      }
    };
  }, [lastElementRef, posts]);

  return (
    <StyledFeedContainer width={'100%'} alignItems={'center'} height={'unset'}>
      {posts &&
        posts.map((post: Post, index) => {
          const isLastElement = index === posts.length - 1;
          return (
            <StyledContainer key={post.id} ref={isLastElement ? lastElementRef : null}>
              <Tweet post={post} />
            </StyledContainer>
          );
        })}
      {loading && <Loader />}
    </StyledFeedContainer>
  );
};

export default Feed;
