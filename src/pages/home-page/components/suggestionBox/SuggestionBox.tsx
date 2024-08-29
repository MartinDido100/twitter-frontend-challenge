import FollowUserBox from '../../../../components/follow-user/FollowUserBox';
import { useGetRecommendedUsers } from '../../../../service/HttpRequestService';
import { useTranslation } from 'react-i18next';
import { StyledSuggestionBoxContainer } from './SuggestionBoxContainer';

const SuggestionBox = () => {
  const { data: users } = useGetRecommendedUsers(6, 0);
  const { t } = useTranslation();

  return (
    <StyledSuggestionBoxContainer>
      <h6>{t('suggestion.who-to-follow')}</h6>
      {users !== undefined && users.length > 0 ? (
        users
          .filter((value, index, array) => {
            return array.indexOf(value) === index;
          })
          .slice(0, 5)
          .map((user) => (
            <FollowUserBox
              key={user.id}
              id={user.id}
              name={user.name}
              username={user.username}
              profilePicture={user.profilePicture}
            />
          ))
      ) : (
        <p>{t('suggestion.no-recommendations')}</p>
      )}
      {users !== undefined && users.length > 5 && <a href="/recommendations">{t('suggestion.show-more')}</a>}
    </StyledSuggestionBoxContainer>
  );
};

export default SuggestionBox;
