import { useEffect } from 'react';
import SuggestionBox from './components/suggestionBox/SuggestionBox';
import ContentContainer from './components/contentContainer/ContentContainer';
import { updateFeed } from '../../redux/user';
import { useGetPosts } from '../../service/HttpRequestService';
import { SearchBar } from '../../components/search-bar/SearchBar';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { StyledUserSuggestionContainer } from './UserSeuggestionContainer';

const HomePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const query = useAppSelector((state) => state.user.query);
  const { fetchPosts } = useGetPosts(query);

  const handleSetUser = async () => {
    try {
      const { data } = await fetchPosts();
      dispatch(updateFeed(data));
    } catch (e) {
      navigate('/sign-in');
    }
  };

  useEffect(() => {
    handleSetUser();
  }, []);

  return (
    <>
      <ContentContainer />
      <StyledUserSuggestionContainer>
        <SearchBar />
        <SuggestionBox />
      </StyledUserSuggestionContainer>
    </>
  );
};

export default HomePage;
