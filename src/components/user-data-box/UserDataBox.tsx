import Avatar from '../common/avatar/Avatar';
import icon from '../../assets/icon.jpg';
import { useNavigate } from 'react-router-dom';
import './UserDataBox.css';
import { UserContainer } from './UserContainer';
import { UserInfoContainer } from './UserInfoContainer';
import { UserInfoText } from './UserInfoText';

interface UserDataBoxProps {
  name?: string;
  username?: string;
  profilePicture?: string;
  id: string;
  onClick?: () => void;
}
export const UserDataBox = ({ name, username, profilePicture, id, onClick }: UserDataBoxProps) => {
  const navigate = useNavigate();

  return (
    <UserContainer onClick={() => onClick ?? navigate(`/profile/${id}`)}>
      <Avatar
        width={'48px'}
        height={'48px'}
        src={profilePicture ?? icon}
        onClick={() => onClick ?? navigate(`/profile/${id}`)}
        alt={name ?? 'Name'}
      />
      <UserInfoContainer>
        <UserInfoText>{name ?? 'Name'}</UserInfoText>
        <UserInfoText color="#566370">{'@' + username ?? '@Username'}</UserInfoText>
      </UserInfoContainer>
    </UserContainer>
  );
};

export default UserDataBox;
