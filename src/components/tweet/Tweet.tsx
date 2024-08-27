import { useState } from 'react';
import { StyledTweetContainer } from './TweetContainer';
import AuthorData from './user-post-data/AuthorData';
import type { Post } from '../../service';
import { StyledReactionsContainer } from './ReactionsContainer';
import Reaction from './reaction/Reaction';
import { useCreateReaction, useDeleteReaction, useGetPostById } from '../../service/HttpRequestService';
import { IconType } from '../icon/Icon';
import { StyledContainer } from '../common/Container';
import ThreeDots from '../common/ThreeDots';
import DeletePostModal from './delete-post-modal/DeletePostModal';
import ImageContainer from './tweet-image/ImageContainer';
import CommentModal from '../comment/comment-modal/CommentModal';
import { useNavigate } from 'react-router-dom';
import { useGetUser } from '../../redux/hooks';
import { useOutsideClick } from '../../hooks/useClickOutside';

interface TweetProps {
  post: Post;
}

const Tweet = ({ post }: TweetProps) => {
  const [actualPost, setActualPost] = useState<Post>(post);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showCommentModal, setShowCommentModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const user = useGetUser();
  const { mutateAsync: createReaction } = useCreateReaction();
  const { mutateAsync: deleteReaction } = useDeleteReaction();
  const { fetchPostById } = useGetPostById(actualPost.id);

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
  }

  const ref = useOutsideClick(closeDeleteModal)

  const handleReaction = async (type: string) => {
    const reacted = actualPost.reactions.find((r) => r.type === type && r.userId === user?.id);
    if (reacted) {
      await deleteReaction({ postId: actualPost.id, type });
    } else {
      await createReaction({ postId: actualPost.id, type });
    }
    handlePostUpdate();
  };

  const handlePostUpdate = async () => {
    const { data } = await fetchPostById();
    setActualPost(data);
  };

  const hasReactedByType = (type: string): boolean => {
    return actualPost.reactions.some((r) => {
      return r.type === type && r.userId === user.id;
    });
  };

  return (
    <>
      {post && (
        <StyledTweetContainer>
          <StyledContainer
            style={{ width: '100%' }}
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'center'}
            maxHeight={'48px'}
            ref={ref}
          >
            <AuthorData
              id={post.author.id}
              name={post.author.name ?? 'Name'}
              username={post.author.username}
              createdAt={post.createdAt}
              profilePicture={post.author.profilePicture}
            />
            {post.authorId === user?.id && (
              <>
                <DeletePostModal
                  show={showDeleteModal}
                  id={post.id}
                  onClose={() => {
                    setShowDeleteModal(false);
                  }}
                />
                <ThreeDots
                  onClick={() => {
                    setShowDeleteModal(!showDeleteModal);
                  }}
                />
              </>
            )}
          </StyledContainer>
          <StyledContainer onClick={() => navigate(`/post/${post.id}`)}>
            <p>{post.content}</p>
          </StyledContainer>
          {post.images && post.images!.length > 0 && (
            <StyledContainer padding={'0 0 0 10%'}>
              <ImageContainer images={post.images} />
            </StyledContainer>
          )}
          <StyledReactionsContainer>
            <Reaction
              img={IconType.CHAT}
              count={actualPost?.qtyComments}
              reactionFunction={() =>
                window.innerWidth > 600 ? setShowCommentModal(true) : navigate(`/compose/comment/${post.id}`)
              }
              increment={0}
              reacted={false}
            />
            <Reaction
              img={IconType.RETWEET}
              count={actualPost?.qtyRetweets}
              reactionFunction={() => handleReaction('RETWEET')}
              increment={1}
              reacted={hasReactedByType('RETWEET')}
            />
            <Reaction
              img={IconType.LIKE}
              count={actualPost?.qtyLikes}
              reactionFunction={() => handleReaction('LIKE')}
              increment={1}
              reacted={hasReactedByType('LIKE')}
            />
          </StyledReactionsContainer>
          <CommentModal show={showCommentModal} post={post} onClose={() => setShowCommentModal(false)} />
        </StyledTweetContainer>
      )}
    </>
  );
};

export default Tweet;
