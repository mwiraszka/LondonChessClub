export interface NavState {
  pathHistory: string[] | null;
}

export const initialState: NavState = {
  pathHistory: null,
};
