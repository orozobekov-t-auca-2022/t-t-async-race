export type RouteName = 'garage' | 'winners';

export type AppState = {
  route: RouteName;
  garagePage: number;
  winnersPage: number;

  createName: string;
  createColor: string;

  updateName: string;
  updateColor: string;
};

export const initialState: AppState = {
  route: 'garage',
  garagePage: 1,
  winnersPage: 1,

  createName: '',
  createColor: '#22c55e',

  updateName: '',
  updateColor: '#22c55e',
};
