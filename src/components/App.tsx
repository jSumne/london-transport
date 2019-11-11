import React, { useState, useEffect, useRef } from "react";
import AppBar from "@material-ui/core/AppBar";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles
} from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { lineApi } from "../axios";
import { Line } from "../types/Line";
import { TFLDrawer } from "./TFLDrawer";
import { AddLinesAction, ADD_LINES } from "../store/types/lines";
import { LineDetail } from "./LineDetail";
import { BikePointDetail } from "./BikePointDetail";

const sorter = (line1: Line, line2: Line): number => {
  if (line1.modeName < line2.modeName) return -1;
  if (line1.modeName > line2.modeName) return 1;

  if (line1.name < line2.name) return -1;
  if (line1.name > line2.name) return 1;

  return 0;
};

const drawerWidth = 280;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex"
    },
    drawer: {
      [theme.breakpoints.up("sm")]: {
        width: drawerWidth,
        flexShrink: 0
      }
    },
    appBar: {
      [theme.breakpoints.up("sm")]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth
      }
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        display: "none"
      }
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3)
    }
  })
);

const App: React.FC = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const theme = useTheme();
  const classes = useStyles(theme);
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current === false) {
      lineApi.interceptors.request.use(
        function(config) {
          // spinning start to show
          setLoading(true);
          return config;
        },
        function(error) {
          return Promise.reject(error);
        }
      );
      didMountRef.current = true;
    }

    lineApi
      .get<Line[]>("Mode/tube,overground,dlr/Status?detail=true")
      .then(function(response) {
        const data = response.data.sort(sorter);
        dispatch<AddLinesAction>({ type: ADD_LINES, payload: data });
        setLoading(false);
      })
      .catch(function(error) {
        console.log(error);
      });
  }, [dispatch]);

  return (
    <Router>
      <div className={classes.root}>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Transport For London
            </Typography>
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer} aria-label="mailbox folders">
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Hidden smUp implementation="css">
            <Drawer
              variant="temporary"
              anchor={theme.direction === "rtl" ? "right" : "left"}
              open={mobileOpen}
              onClose={handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper
              }}
              ModalProps={{
                keepMounted: true // Better open performance on mobile.
              }}
            >
              <TFLDrawer loading={loading} />
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper
              }}
              variant="permanent"
              open
            >
              <TFLDrawer loading={loading} />
            </Drawer>
          </Hidden>
        </nav>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Switch>
            <Route path="/lines/:lineId">
              <LineDetail />
            </Route>
            <Route path="/cycles">
              <BikePointDetail />
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
};

export default App;
