import React, { ChangeEvent, useState } from 'react';
import Button from '../button/Button';
import TweetInput from '../tweet-input/TweetInput';
import { setLength, updateFeed } from '../../redux/user';
import ImageContainer from '../tweet/tweet-image/ImageContainer';
import { BackArrowIcon } from '../icon/Icon';
import ImageInput from '../common/ImageInput';
import { useTranslation } from 'react-i18next';
import { ButtonType } from '../button/StyledButton';
import { StyledTweetBoxContainer } from './TweetBoxContainer';
import { StyledContainer } from '../common/Container';
import { StyledButtonContainer } from './ButtonContainer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useHttpRequestService } from '../../service/HttpRequestService';
import { useGetUser } from '../../redux/hooks';

interface TweetBoxProps {
  parentId?: string;
  close?: () => void;
  mobile?: boolean;
}

const TweetBox = ({ parentId, close, mobile }: TweetBoxProps) => {
  const [content, setContent] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
  const [imagesPreview, setImagesPreview] = useState<string[]>([]);

  const { length, query } = useSelector((state: RootState) => state.user);
  const httpService = useHttpRequestService();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const user = useGetUser();

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  const handleSubmit = async () => {
    try {
      //TODO: Upload post here
      //TODO: Check how images are uploaded and fix it in httpService
      setContent('');
      setImages([]);
      setImagesPreview([]);
      dispatch(setLength(length + 1));
      const posts = await httpService.getPosts(query);
      dispatch(updateFeed(posts));
      close && close();
    } catch (e) {
      console.log(e);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((i, idx) => idx !== index);
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
