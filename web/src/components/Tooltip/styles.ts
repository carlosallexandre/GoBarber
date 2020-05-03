import styled from 'styled-components';

export const Container = styled.div`
  position: relative;

  &:hover span {
    opacity: 1;
    visibility: visible;
  }

  span {
    opacity: 0;
    visibility: hidden;
    transition: all 0.4s;
    position: absolute;
    background-color: #ff9000;
    color: #312e38;
    width: 220px;
    font-size: 14px;
    font-weight: medium;
    border-radius: 4px;
    padding: 8px;
    bottom: calc(100% + 12px);
    left: 50%;
    transform: translateX(-50%);

    &::after {
      border-width: 6px 6px 0 6px;
      border-style: solid;
      border-color: #ff9000 transparent;

      content: '';
      position: absolute;
      top: 100%;
      right: 50%;
      transform: translateX(50%);
    }
  }
`;
