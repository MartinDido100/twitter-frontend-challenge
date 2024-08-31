import { useEffect, useState } from 'react';
import Button from '../button/Button';
import { useFollowUser, useUnfollowUser } from '../../service/HttpRequestService';
import UserDataBox from '../user-data-box/UserDataBox';
import { useTranslation } from 'react-i18next';
import { ButtonType } from '../button/StyledButton';
import { useGetUser } from '../../redux/hooks';
import { FollowBoxContainer } from './FollowBoxContainer';
import { useQueryClient } from '@tanstack/react-query';

interface FollowUserBoxProps {
  profilePicture?: string;
  name?: string;
  username?: string;
  id: string;
}

const FollowUserBox = ({ profilePicture, name, username, id }: FollowUserBoxProps) => {
  const { t } = useTranslation();
  const { mutateAsync: followUser } = useFollowUser();
  const { mutateAsync: unfollowUser } = useUnfollowUser();
  const [isFollowing, setIsFollowing] = useState(false);
  const user = useGetUser();
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsFollowing(user?.following.some((followingId: string) => followingId === id));
  }, []);

  const handleFollow = async () => {
    if (isFollowing) {
      await unfollowUser(
        { userId: id },
        {
          onError: (e) => {
            console.log(e);
          },
          onSuccess: async () => {
            setIsFollowing(false);
            await Promise.all([
              queryClient.invalidateQueries({
                queryKey: ['user'],
              }),
              queryClient.invalidateQueries({
                queryKey: ['feed'],
              }),
            ]);
          },
        }
      );
    } else {
      await followUser(
        { userId: id },
        {
          onError: (e) => {
            console.log(e);
          },
          onSuccess: async () => {
            setIsFollowing(true);
            await Promise.all([
              queryClient.invalidateQueries({
                queryKey: ['user'],
              }),
              queryClient.invalidateQueries({
                queryKey: ['feed'],
              }),
            ]);
          },
        }
      );
    }
  };

  return (
    <FollowBoxContainer>
      <UserDataBox id={id} name={name!} profilePicture={profilePicture!} username={username!} />
      <Button
        text={isFollowing ? t('buttons.unfollow') : t('buttons.follow')}
        buttonType={isFollowing ? ButtonType.DELETE : ButtonType.FOLLOW}
        size={'SMALL'}
        onClick={handleFollow}
      />
    </FollowBoxContainer>
  );
};

export default FollowUserBox;
