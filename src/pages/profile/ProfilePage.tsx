import { useEffect, useState } from 'react';
import ProfileInfo from './ProfileInfo';
import { useNavigate, useParams } from 'react-router-dom';
import Modal from '../../components/modal/Modal';
import { useTranslation } from 'react-i18next';
import { User } from '../../service';
import { ButtonType } from '../../components/button/StyledButton';
import { useDeleteProfile, useFollowUser, useGetProfile, useUnfollowUser } from '../../service/HttpRequestService';
import Button from '../../components/button/Button';
import ProfileFeed from '../../components/feed/ProfileFeed';
import { StyledContainer } from '../../components/common/Container';
import { StyledH5 } from '../../components/common/text';
import { useGetUser } from '../../redux/hooks';
import { useQueryClient } from '@tanstack/react-query';

const ProfilePage = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [following, setFollowing] = useState<boolean>(false);
  const [modalValues, setModalValues] = useState({
    text: '',
    title: '',
    type: ButtonType.DEFAULT,
    buttonText: '',
  });

  const user = useGetUser();
  const { mutateAsync: followUser } = useFollowUser();
  const { mutateAsync: unfollowUser } = useUnfollowUser();
  const { mutateAsync: deleteProfile } = useDeleteProfile();
  const id = useParams().id;
  const { data } = useGetProfile(id!);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { t } = useTranslation();

  const handleButtonType = (): { component: ButtonType; text: string } => {
    if (profile?.id === user?.id) return { component: ButtonType.DELETE, text: t('buttons.delete') };
    if (following) return { component: ButtonType.OUTLINED, text: t('buttons.unfollow') };
    else return { component: ButtonType.FOLLOW, text: t('buttons.follow') };
  };
  const handleSubmit = async () => {
    if (profile?.id === user?.id) {
      await deleteProfile();
      localStorage.removeItem('token');
      navigate('sign-in');
    } else {
      await unfollowUser(
        { userId: profile!.id },
        {
          onSuccess: async () => {
            setFollowing(false);
            setShowModal(false);
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

  useEffect(() => {
    getProfileData();
  }, [id, data]);

  if (!id) return null;

  const handleButtonAction = async () => {
    if (profile?.id === user?.id) {
      setShowModal(true);
      setModalValues({
        title: t('modal-title.delete-account'),
        text: t('modal-content.delete-account'),
        type: ButtonType.DELETE,
        buttonText: t('buttons.delete'),
      });
    } else {
      if (following) {
        setShowModal(true);
        setModalValues({
          text: t('modal-content.unfollow'),
          title: `${t('modal-title.unfollow')} @${profile?.username}?`,
          type: ButtonType.FOLLOW,
          buttonText: t('buttons.unfollow'),
        });
      } else {
        await followUser(
          { userId: profile!.id },
          {
            onError: (e) => {
              console.log(e);
            },
            onSuccess: async () => {
              setFollowing(true);
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
    }
  };

  const getProfileData = async () => {
    if (data === undefined) return;
    setProfile(data);
    setFollowing(data.following);
  };

  return (
    <>
      <StyledContainer maxHeight={'100vh'} borderRight={'1px solid #ebeef0'} maxWidth={'600px'}>
        {profile && (
          <>
            <StyledContainer borderBottom={'1px solid #ebeef0'} maxHeight={'212px'} padding={'16px'}>
              <StyledContainer alignItems={'center'} padding={'24px 0 0 0'} flexDirection={'row'}>
                <ProfileInfo
                  name={profile!.name!}
                  username={profile!.username}
                  profilePicture={profile!.profilePicture}
                />
                <Button
                  buttonType={handleButtonType().component}
                  size={'100px'}
                  onClick={handleButtonAction}
                  text={handleButtonType().text}
                />
              </StyledContainer>
            </StyledContainer>
            <StyledContainer width={'100%'}>
              {!profile.private || profile.id === user.id ? <ProfileFeed /> : <StyledH5>Private account</StyledH5>}
            </StyledContainer>
            <Modal
              show={showModal}
              text={modalValues.text}
              title={modalValues.title}
              acceptButton={
                <Button
                  buttonType={modalValues.type}
                  text={modalValues.buttonText}
                  size={'MEDIUM'}
                  onClick={handleSubmit}
                />
              }
              onClose={() => {
                setShowModal(false);
              }}
            />
          </>
        )}
      </StyledContainer>
    </>
  );
};

export default ProfilePage;
