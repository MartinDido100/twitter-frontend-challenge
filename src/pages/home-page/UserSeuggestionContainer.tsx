import styled from 'styled-components';

export const StyledUserSuggestionContainer = styled.div`
  flex: 1;
  width: 100%;
  padding-left: 16px;
  padding-top: 16px;
  gap: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: sticky;
  top: 0;
  border-left: 1px solid ${(props) => props.theme.colors.containerLine};
  justify-content: flex-start;

  @media (max-width: 1100px) {
    display: none;
  }
`;
