import React, { useState, useEffect } from "react";

import { bikePointApi } from "../axios";
import { BikePoint } from "../types/BikePoint";
import {
  Theme,
  createStyles,
  makeStyles,
  useTheme,
  TextField,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Typography
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexWrap: "wrap"
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200
    },
    button: {
      margin: theme.spacing(1)
    }
  })
);

export const BikePointDetail: React.FC = () => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [input, setInput] = useState("");
  const [bikePoints, setBikePoints] = useState<BikePoint[]>([]);

  useEffect(() => {
    bikePointApi.interceptors.request.use(
      function(config) {
        // spinning start to show
        setLoading(true);
        return config;
      },
      function(error) {
        return Promise.reject(error);
      }
    );
  }, []);

  const sendRequest = () => {
    bikePointApi
      .get<BikePoint[]>(`Search?query=${input}`)
      .then(function(response) {
        setLoading(false);
        setBikePoints(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
    setQuery(input);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (input !== "") {
      sendRequest();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const bikePointInfo = (points: BikePoint[]) => {
    const listItems = points.map((point, index) => {
      return (
        <ListItem key={index}>
          <ListItemText
            primary={point.id.substring(11)}
            secondary={`${point.commonName} (${point.lat}, ${point.lon})`}
          />
        </ListItem>
      );
    });
    if (listItems.length > 0) {
      return <List>{listItems}</List>;
    } else if (query !== "") {
      return (
        <Typography variant="h6" component="h2">
          No bike points found for '{query}'
        </Typography>
      );
    }
  };

  return (
    <>
      <form className={classes.container} onSubmit={handleSubmit}>
        <div>
          <TextField
            id="standard-basic"
            className={classes.textField}
            label="Location"
            margin="normal"
            value={input}
            onChange={handleChange}
            required
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          type="submit"
        >
          Search
        </Button>
      </form>
      {loading ? <CircularProgress /> : bikePointInfo(bikePoints)}
    </>
  );
};
