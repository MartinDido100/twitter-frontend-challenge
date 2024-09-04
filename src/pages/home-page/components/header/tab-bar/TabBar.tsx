import React, { useState } from 'react';
import Tab from './tab/Tab';
import { setLastPost, setQuery, updateFeed } from '../../../../../redux/user';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../../../redux/hooks';
import { StyledTabBarContainer } from './TabBarContainer';

const TabBar = () => {
  const [activeFirstPage, setActiveFirstPage] = useState(true);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const handleClick = async (value: boolean, query: string) => {
    setActiveFirstPage(value);
    dispatch(setLastPost(''));
    dispatch(setQuery(query));
  };

  return (
    <>
      <StyledTabBarContainer>
        <Tab active={activeFirstPage} text={t('header.for-you')} onClick={() => handleClick(true, '')} />
        <Tab active={!activeFirstPage} text={t('header.following')} onClick={() => handleClick(false, 'following')} />
      </StyledTabBarContainer>
    </>
  );
};

export default TabBar;
