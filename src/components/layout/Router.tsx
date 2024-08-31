import { useEffect, useState } from 'react';
import { createBrowserRouter, Outlet, useNavigate } from 'react-router-dom';
import { StyledSideBarPageWrapper } from '../../pages/side-bar-page/SideBarPageWrapper';
import NavBar from '../navbar/NavBar';
import SignUpPage from '../../pages/auth/sign-up/SignUpPage';
import SignInPage from '../../pages/auth/sign-in/SignInPage';
import HomePage from '../../pages/home-page/HomePage';
import RecommendationPage from '../../pages/recommendation/RecommendationPage';
import ProfilePage from '../../pages/profile/ProfilePage';
import TweetPage from '../../pages/create-tweet-page/TweetPage';
import CommentPage from '../../pages/create-comment-page/CommentPage';
import { useMe } from '../../service/HttpRequestService';
import PostPage from '../../pages/post-page/PostPage';
import { setUser } from '../../redux/user';
import { useAppDispatch } from '../../redux/hooks';

const ProtectedNav = () => {
  const { data, error } = useMe();
  const dispatch = useAppDispatch();
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const navigate = useNavigate();

  const checkIsLogged = async () => {
    dispatch(setUser(data));
    if (error) {
      navigate('/sign-in');
      return;
    }
    setIsLogged(true);
  };

  useEffect(() => {
    if (data === undefined) return;
    checkIsLogged();
  }, [data]);

  return (
    <>
      {isLogged && (
        <StyledSideBarPageWrapper>
          <NavBar />
          <Outlet />
        </StyledSideBarPageWrapper>
      )}
    </>
  );
};

export const ROUTER = createBrowserRouter([
  {
    path: '/sign-up',
    element: <SignUpPage />,
  },
  {
    path: '/sign-in',
    element: <SignInPage />,
  },
  {
    element: <ProtectedNav />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/recommendations',
        element: <RecommendationPage />,
      },
      {
        path: '/profile/:id',
        element: <ProfilePage />,
      },
      {
        path: '/post/:id',
        element: <PostPage />,
      },
      {
        path: '/compose/tweet',
        element: <TweetPage />,
      },
      {
        path: '/post/:id',
        element: <CommentPage />,
      },
    ],
  },
]);
