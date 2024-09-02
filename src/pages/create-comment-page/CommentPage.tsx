import { useEffect, useState } from 'react';
import { BackArrowIcon } from '../../components/icon/Icon';
import Button from '../../components/button/Button';
import AuthorData from '../../components/tweet/user-post-data/AuthorData';
import ImageContainer from '../../components/tweet/tweet-image/ImageContainer';
import { useParams } from 'react-router-dom';
import TweetInput from '../../components/tweet-input/TweetInput';
import ImageInput from '../../components/common/ImageInput';
import { useTranslation } from 'react-i18next';
import { ButtonType } from '../../components/button/StyledButton';
import { StyledContainer } from '../../components/common/Container';
import { StyledLine } from '../../components/common/Line';
import { StyledP } from '../../components/common/text';
import { useQueryClient } from '@tanstack/react-query';
import { useGetUser } from '../../redux/hooks';
import { useGetPostById } from '../../service/HttpRequestService';
import { Post } from '../../service';

const CommentPage = () => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [post, setPost] = useState<Post | null>(null);
  const user = useGetUser();
  const { id: postId } = useParams();
  const { data, error } = useGetPostById(postId!);
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  useEffect(() => {
    window.innerWidth > 600 && exit();
  }, []);

  useEffect(() => {
    if(error !== undefined) exit();
    if (data === undefined) return;
    setPost(data);
  }, [postId, data,error]);

  const exit = () => {
    window.history.back();
  };

  const handleSubmit = async () => {
    setContent('');
    setImages([]);
    await queryClient.invalidateQueries({
      queryKey: ['feed'],
    });
    exit();
  };
  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((i, idx) => idx !== index);
    setImages(newImages);
  };

  return (
    <StyledContainer padding={'16px'} height={'unset'}>
      <StyledContainer flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
        <BackArrowIcon onClick={exit} />
        <Button
          text={'Tweet'}
          buttonType={ButtonType.DEFAULT}
          size={'SMALL'}
          onClick={handleSubmit}
          disabled={content.length === 0}
        />
      </StyledContainer>
      {post && (
        <StyledContainer gap={'16px'}>
          <AuthorData
            id={post.authorId}
            name={post.author.name ?? 'Name'}
            username={post.author.username}
            createdAt={post.createdAt}
            profilePicture={post.author.profilePicture}
          />
          <StyledContainer flexDirection={'row'}>
            <StyledLine />
            <StyledContainer gap={'8px'}>
              <StyledP primary>{post.content}</StyledP>
              {post.images && <ImageContainer images={post.images} />}
            </StyledContainer>
          </StyledContainer>
          <StyledContainer gap={'4px'}>
            <TweetInput
              maxLength={240}
              placeholder={t('placeholder.comment')}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              src={user?.profilePicture}
            />
            {images.length > 0 && (
              <ImageContainer
                editable
                images={images.map((i) => URL.createObjectURL(i))}
                removeFunction={handleRemoveImage}
              />
            )}
            <StyledContainer>
              <ImageInput setImages={setImages} parentId={`comment-page-${postId}`} />
            </StyledContainer>
          </StyledContainer>
        </StyledContainer>
      )}
    </StyledContainer>
  );
};
export default CommentPage;
