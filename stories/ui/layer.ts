import styled from "styled-components";

export const Column = styled.div`
  display: flex;
  flex: none;
  flex-direction: column;

  & > *:not(:last-child) {
    margin-bottom: 8px;
  }
`;

export const Row = styled.div`
  display: flex;

  & > *:not(:last-child) {
    margin-right: 8px;
  }
`;
