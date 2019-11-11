import React from "react";
import {
  Divider,
  List,
  ListItem,
  CircularProgress,
  ListItemText,
  ListItemIcon
} from "@material-ui/core";
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles
} from "@material-ui/core/styles";
import NightsStayIcon from "@material-ui/icons/NightsStay";
import WarningIcon from "@material-ui/icons/Warning";
import { useSelector } from "react-redux";
import { AppState } from "../store";
import { Line } from "../types/Line";
import { Link } from "react-router-dom";

interface DrawerProps {
  loading: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: theme.mixins.toolbar
  })
);

export const TFLDrawer: React.FC<DrawerProps> = ({ loading }) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const lines = useSelector<AppState, Line[]>(state => state.lines);
  return (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        {loading ? (
          <ListItem>
            <CircularProgress />
          </ListItem>
        ) : (
          lines.map((line, index) => (
            <ListItem button key={index} component={Link} to={`/lines/${index}`} >
              <ListItemText primary={line.name} />
              {line.serviceTypes.some(l => l.name === "Night") ? (
                <ListItemIcon>
                  <NightsStayIcon />
                </ListItemIcon>
              ) : null}
              {line.lineStatuses.some(l => l.statusSeverity !== 10) ? (
                <ListItemIcon>
                  <WarningIcon />
                </ListItemIcon>
              ) : null}
            </ListItem>
          ))
        )}
        <Divider />
        <ListItem button component={Link} to="/cycles" > 
          <ListItemText primary={"Cycle Hire"} />
        </ListItem>
      </List>
    </div>
  );
};
