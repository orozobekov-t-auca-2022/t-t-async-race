export type RouteName = 'garage' | 'winners';

export type SortField = 'wins' | 'time';
export type SortOrder = 'ASC' | 'DESC';

export type AppState = {
  route: RouteName;
  garagePage: number;
  winnersPage: number;
  winnersSort: SortField;
  winnersSortOrder: SortOrder;

  createName: string;
  createColor: string;

  updateName: string;
  updateColor: string;
};

export const initialState: AppState = {
  route: 'garage',
  garagePage: 1,
  winnersPage: 1,
  winnersSort: 'wins',
  winnersSortOrder: 'DESC',

  createName: '',
  createColor: '#22c55e',

  updateName: '',
  updateColor: '#22c55e',
};
