import { Direction } from '../github/types';

export const swapDirection = <T>(dir: Direction, e1: T, e2: T): [T, T] =>
  dir === 'asc' ? [e1, e2] : [e2, e1];
export const compareStrings = (left: string, right: string) =>
  left.localeCompare(right, 'en');
export const compareNumbers = (left: number, right: number) => right - left;
export const compareValues = <T>(left: T, right: T) => {
  if (typeof left === 'string' && typeof right === 'string') {
    return compareStrings(left, right);
  }
  if (typeof left === 'number' && typeof right === 'number') {
    return compareNumbers(left, right);
  }
  return 0;
};
