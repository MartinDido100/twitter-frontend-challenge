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
import { useHttpRequestService } from '../../service/HttpRequestService';
import PostPage from '../../pages/post-page/PostPage';
import { setUser } from '../../redux/user';
import { useAppDispatch } from '../../redux/hooks';

const ProtectedNav = () => {
  const service = useHttpRequestService();
  const [isLogged, setIsLogged] = useState<boolean | undefined>(undefined);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const getIsLogged = async () => {
    try {
      const user = await service.me();
      dispatch(setUser(user));
      setIsLogged(true);
    } catch (_) {
      navigate('/sign-in');
    }
  };

  useEffect(() => {
    getIsLogged();
  }, [service]);

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
