import { ChangeEvent, useState } from 'react';
import Button from '../button/Button';
import TweetInput from '../tweet-input/TweetInput';
import ImageContainer from '../tweet/tweet-image/ImageContainer';
import { BackArrowIcon } from '../icon/Icon';
import ImageInput from '../common/ImageInput';
import { useTranslation } from 'react-i18next';
import { ButtonType } from '../button/StyledButton';
import { StyledTweetBoxContainer } from './TweetBoxContainer';
import { StyledContainer } from '../common/Container';
import { StyledButtonContainer } from './ButtonContainer';
import { useCreatePost } from '../../service/HttpRequestService';
import { useGetUser } from '../../redux/hooks';
import { PostData } from '../../service';
import { useQueryClient } from '@tanstack/react-query';

interface TweetBoxProps {
  parentId?: string;
  close?: () => void;
  mobile?: boolean;
}

const TweetBox = ({ parentId, close, mobile }: TweetBoxProps) => {
  const [content, setContent] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
  const [imagesPreview, setImagesPreview] = useState<string[]>([]);
  const { mutateAsync: createPost } = useCreatePost();
  const { t } = useTranslation();
  const user = useGetUser();
  const queryClient = useQueryClient();

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  const handleSubmit = async () => {
    const data: PostData = {
      content,
      images,
    };
    await createPost(data, {
      onError: (e) => {
        console.log(e);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['feed'],
        });
      },
    });
    setContent('');
    setImages([]);
    setImagesPreview([]);
    close && close();
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, idx) => idx !== index);
    const newImagesPreview = newImages.map((i) => URL.createObjectURL(i));
    setImages(newImages);
    setImagesPreview(newImagesPreview);
  };

  const handleAddImage = (newImages: File[]) => {
    setImages(newImages);
    const newImagesPreview = newImages.map((i) => URL.createObjectURL(i));
    setImagesPreview(newImagesPreview);
  };

  return (
    <StyledTweetBoxContainer>
      {mobile && (
        <StyledContainer flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <BackArrowIcon onClick={close} />
          <Button
            text={'Tweet'}
            buttonType={ButtonType.DEFAULT}
            size={'SMALL'}
            onClick={handleSubmit}
            disabled={content.length === 0}
          />
        </StyledContainer>
      )}
      <StyledContainer style={{ width: '100%' }}>
        <TweetInput
          onChange={handleChange}
          maxLength={240}
          placeholder={t('placeholder.tweet')}
          value={content}
          src={user?.profilePicture}
        />
        <StyledContainer padding={'0 0 0 10%'}>
          <ImageContainer editable images={imagesPreview} removeFunction={handleRemoveImage} />
        </StyledContainer>
        <StyledButtonContainer>
          <ImageInput setImages={handleAddImage} parentId={parentId} />
          {!mobile && (
            <Button
              text={'Tweet'}
              buttonType={ButtonType.DEFAULT}
              size={'SMALL'}
              onClick={handleSubmit}
              disabled={content.length <= 0 || content.length > 240 || images.length > 4 || images.length < 0}
            />
          )}
        </StyledButtonContainer>
      </StyledContainer>
    </StyledTweetBoxContainer>
  );
};

export default TweetBox;
