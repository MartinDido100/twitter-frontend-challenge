import { useEffect, useState } from 'react';
import Button from '../button/Button';
import { useFollowUser, useUnfollowUser } from '../../service/HttpRequestService';
import UserDataBox from '../user-data-box/UserDataBox';
import { useTranslation } from 'react-i18next';
import { ButtonType } from '../button/StyledButton';
import './FollowUserBox.css';
import { useGetUser } from '../../redux/hooks';

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

  useEffect(() => {
    // setIsFollowing(r?.following.some((f: Author) => f.id === user?.id));
  }, []);

  const handleFollow = async () => {
    if (isFollowing) {
      await unfollowUser({ userId: id });
    } else {
      await followUser({ userId: id });
    }
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="box-container">
      <UserDataBox id={id} name={name!} profilePicture={profilePicture!} username={username!} />
      <Button
        text={isFollowing ? t('buttons.unfollow') : t('buttons.follow')}
        buttonType={isFollowing ? ButtonType.DELETE : ButtonType.FOLLOW}
        size={'SMALL'}
        onClick={handleFollow}
      />
    </div>
  );
};

export default FollowUserBox;
