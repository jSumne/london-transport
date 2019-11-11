import { LinesState, AddLinesAction, ADD_LINES } from "../types/lines";

const initialState: LinesState = {
  lines: []
};

export function linesReducer(
  state = initialState,
  action: AddLinesAction
): LinesState {
  switch (action.type) {
    case ADD_LINES:
      return {
        ...state,
        lines: action.payload
      };
    default:
      return state;
  }
}
