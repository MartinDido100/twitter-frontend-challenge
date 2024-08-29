import styled from 'styled-components';

export const StyledSideBarPageWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  transition: ease-in-out 0.3s;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-left: 15%;
  padding-right: 9%;
  overflow: scroll;

  @media (max-width: 600px) {
    justify-content: flex-start;
    flex-direction: column;

    padding-left: 0;
    padding-right: 0;
  }
`;
