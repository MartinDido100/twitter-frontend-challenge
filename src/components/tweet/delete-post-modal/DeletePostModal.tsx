import React, { useState } from 'react';
import { DeleteIcon } from '../../icon/Icon';
import Modal from '../../modal/Modal';
import Button from '../../button/Button';
import { updateFeed } from '../../../redux/user';
import { useDeletePost } from '../../../service/HttpRequestService';
import { useTranslation } from 'react-i18next';
import { ButtonType } from '../../button/StyledButton';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { Post } from '../../../service';
import { StyledDeletePostModalContainer } from './DeletePostModalContainer';
import { useQueryClient } from '@tanstack/react-query';

interface DeletePostModalProps {
  show: boolean;
  onClose: () => void;
  id: string;
}

export const DeletePostModal = ({ show, id, onClose }: DeletePostModalProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const feed = useAppSelector((state) => state.user.feed);
  const dispatch = useAppDispatch();
  const { mutateAsync } = useDeletePost();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const handleDelete = async () => {
    try {
      await mutateAsync(
        { id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ['feed'],
            });
          },
        }
      );
      const newFeed = feed.filter((post: Post) => post.id !== id);
      dispatch(updateFeed(newFeed));
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    onClose();
  };

  return (
    <>
      {show && (
        <>
          <StyledDeletePostModalContainer onClick={() => setShowModal(true)}>
            <DeleteIcon />
            <p>{t('buttons.delete')}</p>
          </StyledDeletePostModalContainer>
          <Modal
            title={t('modal-title.delete-post') + '?'}
            text={t('modal-content.delete-post')}
            show={showModal}
            onClose={handleClose}
            acceptButton={
              <Button
                text={t('buttons.delete')}
                buttonType={ButtonType.DELETE}
                size={'MEDIUM'}
                onClick={handleDelete}
              />
            }
          />
        </>
      )}
    </>
  );
};

export default DeletePostModal;
