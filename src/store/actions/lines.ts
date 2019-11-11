import { Line } from "../../types/Line";
import { ADD_LINES, AddLinesAction } from "../types/lines";

export function addLines(newLines: Line[]): AddLinesAction {
  return {
    type: ADD_LINES,
    payload: newLines
  };
}
