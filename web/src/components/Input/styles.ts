import styled, { css } from 'styled-components';

import Tooltip from '../Tooltip';

interface ContainerProps {
  isFocus: boolean;
  isFilled: boolean;
  hasError: boolean;
}

export const Container = styled.div<ContainerProps>`
  background: #232129;
  border-radius: 10px;
  padding: 16px;

  color: #666360;
  border: 2px solid #232129;

  display: flex;
  align-items: center;

  & + div {
    margin-top: 8px;
  }

  ${props =>
    props.hasError &&
    css`
      border: 2px solid #c53030;
    `}

  ${props =>
    props.isFocus &&
    css`
      color: #ff9000;
      border: 2px solid #ff9000;
    `}

  ${props =>
    props.isFilled &&
    css`
      color: #ff9000;
    `}

  input {
    background: transparent;
    border: 0;
    flex: 1;
    color: #f4ede8;

    &::placeholder {
      color: #666360;
    }
  }

  svg {
    margin-right: 16px;
  }
`;

export const Error = styled(Tooltip)`
  margin-left: 16px;
  height: 20px;

  svg {
    margin-right: 0;
    font-size: 20px;
    color: #c53030;
  }

  span {
    background-color: #c53030;
    color: #fff;

    &:after {
      border-color: #c53030 transparent;
    }
  }
`;
