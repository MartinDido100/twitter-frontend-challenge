import { Post } from '../../service';
import { StyledContainer, StyledFeedContainer } from '../common/Container';
import Tweet from '../tweet/Tweet';
import Loader from '../loader/Loader';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

interface FeedProps {
  posts: Post[];
  loading: boolean;
}

const Feed = ({ posts, loading }: FeedProps) => {
  const lastPost = useInfiniteScroll(loading);

  return (
    <StyledFeedContainer width={'100%'} alignItems={'center'} height={'unset'}>
      {posts &&
        posts.map((post: Post) => (
          <StyledContainer ref={lastPost} key={post.id}>
            <Tweet post={post} />
          </StyledContainer>
        ))}
      {loading && <Loader />}
    </StyledFeedContainer>
  );
};

export default Feed;
