import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { ColumnType, engineerOverviewSlice } from './engineerOverviewSlice';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { Direction } from '../github/types';

interface SortArrowProps {
  active: boolean;
}

const SortArrow = styled.span<SortArrowProps>`
  display: ${(props) => (props.active ? 'unset' : 'none')};
  margin-left: 8px;
`;

const SortToggleSpan = styled.span`
  cursor: pointer;
`;

interface SortToggleProps<CType> {
  id: CType;
  children: ReactNode;
}

interface SortToggleBaseProps<T> extends SortToggleProps<T> {
  orderBy: T;
  direction: Direction;
  onClick: (id: T) => void;
}

export function SortToggleBase<T>({
  id,
  orderBy,
  direction,
  children,
  onClick,
}: SortToggleBaseProps<T>) {
  const isActive = orderBy === id;

  const isAscActive = isActive && direction === 'asc';
  const isDescActive = isActive && direction === 'desc';

  return (
    <SortToggleSpan onClick={() => onClick(id)}>
      {children}
      <SortArrow active={isDescActive}>▲</SortArrow>
      <SortArrow active={isAscActive}>▼</SortArrow>
    </SortToggleSpan>
  );
}

export default function SortToggle({
  id,
  children,
}: SortToggleProps<ColumnType>) {
  const { direction, orderBy } = useAppSelector((state) => state.overview);
  const dispatch = useAppDispatch();
  const onClick = () => {
    dispatch(engineerOverviewSlice.actions.toggleColumn(id));
  };

  return (
    <SortToggleBase
      id={id}
      orderBy={orderBy}
      direction={direction}
      onClick={onClick}
    >
      {children}
    </SortToggleBase>
  );
}
