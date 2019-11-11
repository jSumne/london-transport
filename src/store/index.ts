import { linesReducer } from "./reducers/lines";

export default linesReducer;
export type AppState = ReturnType<typeof linesReducer>;
