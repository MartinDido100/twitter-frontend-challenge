import styled, { css } from 'styled-components';
import { CSSProperties } from 'react';

type ContainerProps = {
  hoverable?: boolean;
} & CSSProperties;

const ContainerBase = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  transition: 0.3s ease-in-out;
  scrollbar-width: auto;
  border-radius: 0;
  min-height: auto;
  min-width: 0;
  width: 100%;
  -webkit-tap-highlight-color: transparent;
`;

export const StyledContainer = styled(ContainerBase).attrs<ContainerProps>((props) => ({
  style: props,
}))<ContainerProps>`
  &:hover {
    ${(props) =>
      props.hoverable &&
      css`
        background-color: ${props.theme.colors.hover};
        cursor: pointer;
      `}
  }
`;

export const StyledFeedContainer = styled(StyledContainer)`
  @media (max-width: 600px) {
    padding-bottom: 3.3rem;
  }
`;

export const StyledScrollableContainer = styled(StyledContainer)`
  scrollbar-width: auto;
  overflow-y: auto;
  max-height: 600px;

  @media (max-width: 600px) {
    overflow-x: hidden;
    overflow-y: unset;
  }
`;

export const StyledOverflowContainer = styled(StyledContainer)`
  position: relative;
`;
