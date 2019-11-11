import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Typography,
  ListItem,
  ListItemText,
  List,
  Divider
} from "@material-ui/core";

import { AppState } from "../store";
import { LineStatus } from "../types/Line";

const disruptionDetails = (statuses: LineStatus[]) => {
  const filteredStatuses = statuses.filter(s => s.statusSeverity !== 10);
  const listItems = filteredStatuses.map((status, index) => (
    <ListItem key={index}>
      <ListItemText primary={status.reason} />
    </ListItem>
  ));
  return (
    <>
      <Typography variant="h6" component="h2">
        Service currently suffering disruptions{" "}
      </Typography>
      <Divider />
      <List>{listItems}</List>
    </>
  );
};

export const LineDetail: React.FC = () => {
  let { lineId } = useParams();
  const statuses = useSelector<AppState, LineStatus[]>(state => {
    if (
      lineId === undefined ||
      (!Array.isArray(state.lines) || !state.lines.length) ||
      state.lines[+lineId] === undefined
    ) {
      return [];
    }

    return state.lines[+lineId].lineStatuses;
  });

  return (
    <>
      {statuses.length === 0 ? null : statuses.some(
          s => s.statusSeverity !== 10
        ) ? (
        disruptionDetails(statuses)
      ) : (
        <Typography variant="h6" component="h2">
          No service disruptions
        </Typography>
      )}
    </>
  );
};
