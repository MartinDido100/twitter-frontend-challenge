import { useState, MouseEvent, useContext } from 'react';
import { StyledTweetContainer } from './TweetContainer';
import AuthorData from './user-post-data/AuthorData';
import type { Post } from '../../service';
import { StyledReactionsContainer } from './ReactionsContainer';
import Reaction from './reaction/Reaction';
import { useCreateReaction, useDeleteReaction } from '../../service/HttpRequestService';
import { IconType } from '../icon/Icon';
import { StyledContainer } from '../common/Container';
import ThreeDots from '../common/ThreeDots';
import DeletePostModal from './delete-post-modal/DeletePostModal';
import ImageContainer from './tweet-image/ImageContainer';
import CommentModal from '../comment/comment-modal/CommentModal';
import { useNavigate } from 'react-router-dom';
import { useGetUser } from '../../redux/hooks';
import { useOutsideClick } from '../../hooks/useClickOutside';
import { useQueryClient } from '@tanstack/react-query';
import { StyledDots } from '../common/StyledDots';
import { ToastContext } from '../toast/FallbackToast';
import { ToastType } from '../toast/Toast';

interface TweetProps {
  post: Post;
}

const Tweet = ({ post }: TweetProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showCommentModal, setShowCommentModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const user = useGetUser();
  const queryClient = useQueryClient();
  const { mutateAsync: createReaction } = useCreateReaction();
  const { mutateAsync: deleteReaction } = useDeleteReaction();
  const [error, setError] = useState<Error | null>(null);
  const ToastCtx = useContext(ToastContext);

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const ref = useOutsideClick(closeDeleteModal);

  const handleReaction = async (type: string) => {
    const reacted = post.reactions.find((r) => r.type === type && r.userId === user?.id);
    if (reacted) {
      await deleteReaction(
        { postId: post.id, type },
        {
          onSuccess: handlePostUpdate,
          onError: (e: Error) => {
            setError(e);
          },
        }
      );
    } else {
      await createReaction(
        { postId: post.id, type },
        {
          onSuccess: handlePostUpdate,
          onError: (e: Error) => {
            setError(e);
          },
        }
      );
    }
  };

  const handlePostUpdate = async () => {
    Promise.all([
      queryClient.invalidateQueries({
        queryKey: ['feed'],
      }),
      queryClient.invalidateQueries({
        queryKey: ['post'],
      }),
    ]);
  };

  const hasReactedByType = (type: string): boolean => {
    return post.reactions.some((r) => {
      return r.type === type && r.userId === user.id;
    });
  };

  return (
    <>
      {ToastCtx && (
        <ToastCtx.Toast message="Error reacting tweet" type={ToastType.ALERT} show={error !== null}></ToastCtx.Toast>
      )}
      {post && (
        <StyledTweetContainer onClick={() => navigate(`/post/${post.id}`)}>
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
                <div onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
                  <DeletePostModal
                    show={showDeleteModal}
                    id={post.id}
                    onClose={() => {
                      setShowDeleteModal(false);
                    }}
                  />
                </div>
                <StyledDots onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
                  <ThreeDots
                    onClick={() => {
                      setShowDeleteModal(!showDeleteModal);
                    }}
                  />
                </StyledDots>
              </>
            )}
          </StyledContainer>
          <StyledContainer>
            <p>{post.content}</p>
          </StyledContainer>
          {post.images && post.images!.length > 0 && (
            <StyledContainer padding={'0 0 0 10%'}>
              <ImageContainer images={post.images} />
            </StyledContainer>
          )}
          <StyledReactionsContainer onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
            <Reaction
              img={IconType.CHAT}
              count={post?.qtyComments}
              reactionFunction={() =>
                window.innerWidth > 600 ? setShowCommentModal(true) : navigate(`/compose/comment/${post.id}`)
              }
              increment={0}
              reacted={false}
            />
            <Reaction
              img={IconType.RETWEET}
              count={post?.qtyRetweets}
              reactionFunction={() => handleReaction('RETWEET')}
              increment={1}
              reacted={hasReactedByType('RETWEET')}
            />
            <Reaction
              img={IconType.LIKE}
              count={post?.qtyLikes}
              reactionFunction={() => handleReaction('LIKE')}
              increment={1}
              reacted={hasReactedByType('LIKE')}
            />
          </StyledReactionsContainer>
          <div onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
            <CommentModal show={showCommentModal} post={post} onClose={() => setShowCommentModal(false)} />
          </div>
        </StyledTweetContainer>
      )}
    </>
  );
};

export default Tweet;
