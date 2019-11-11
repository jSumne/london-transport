import { Line } from "../../types/Line";

export const ADD_LINES = "ADD_LINES";

export interface LinesState {
  lines: Line[];
}

export interface AddLinesAction {
  type: typeof ADD_LINES;
  payload: Line[];
}
