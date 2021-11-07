import React, { useCallback, useMemo } from "react";
import styles from "./sidebar.module.scss";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Radio,
  RadioGroup,
  FormLabel,
  FormControlLabel,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  getSelectedParameter,
  getMode,
  getOstankinoModePeriod,
} from "../../root-slice/root-selectors";
import {
  setParameter,
  setMode,
  OSTANKINO_MODE,
  BASE_MODE,
  setOstankinoModePeriod,
} from "../../root-slice";
import { Legend } from "../legend";
import { DateOptions } from "../../config/constants";

const parameters = [
  { id: 1, name: "co", element: <span>CO</span> },
  {
    id: 2,
    name: "no2",
    element: (
      <span>
        NO<sub>2</sub>
      </span>
    ),
  },
  { id: 3, name: "no", element: <span>NO</span> },
  {
    id: 4,
    name: "pm10",
    element: (
      <span>
        PM<sub>10</sub>
      </span>
    ),
  },
  {
    id: 5,
    name: "pm25",
    element: (
      <span>
        PM<sub>25</sub>
      </span>
    ),
  },
];

export const Sidebar = () => {
  const param = useSelector(getSelectedParameter);
  const mode = useSelector(getMode);
  const ostankinoPeriod = useSelector(getOstankinoModePeriod);
  const isBaseMode = mode === BASE_MODE;

  const dispatch = useDispatch();

  const handleChange = useCallback(
    (event) => {
      dispatch(setParameter(event.target.value));
    },
    [dispatch]
  );

  const handleChangePeriod = useCallback(
    (event) => {
      dispatch(setOstankinoModePeriod(event.target.value));
    },
    [dispatch]
  );

  const handleChangeMode = useCallback(() => {
    if (isBaseMode) {
      dispatch(setMode(OSTANKINO_MODE));
    } else {
      dispatch(setMode(BASE_MODE));
    }
  }, [isBaseMode, dispatch]);

  const options = useMemo(
    () =>
      DateOptions.map((item) => ({
        name: Object.keys(item)[0],
        value: item[Object.keys(item)[0]].join(","),
      })),
    []
  );

  return (
    <div className={styles.container}>
      <div className={styles.label}>
        <FormLabel component="legend">Слои</FormLabel>
        <RadioGroup value={mode} onChange={handleChangeMode} row>
          <FormControlLabel
            value="base"
            control={<Radio size="small" />}
            label="Все станции"
          />
          <FormControlLabel
            value="ostankino"
            control={<Radio size="small" />}
            label="Останкино"
          />
        </RadioGroup>
      </div>

      {isBaseMode && (
        <>
          <FormLabel component="legend">Выберите параметр</FormLabel>
          <FormControl sx={{ m: 1, minWidth: 200, marginLeft: 0 }}>
            <InputLabel id="demo-simple-select-autowidth-label">
              Параметр
            </InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={param}
              onChange={handleChange}
              label="Параметр"
            >
              <MenuItem value="">Очистить</MenuItem>
              {parameters.map((p) => {
                return (
                  <MenuItem value={p.name} key={p.id}>
                    {p.element}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          {param && <Legend />}
        </>
      )}

      {!isBaseMode && (
        <>
          <FormLabel component="legend">Выберите дату</FormLabel>
          <FormControl sx={{ m: 1, minWidth: 200, marginLeft: 0 }}>
            <InputLabel id="demo-simple-select-autowidth-label">
              Период
            </InputLabel>
            <Select
              label="Период"
              options={options}
              onChange={handleChangePeriod}
              value={ostankinoPeriod}
            >
              {options.map((item) => {
                return (
                  <MenuItem value={item.value} key={item.value}>
                    {item.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </>
      )}
    </div>
  );
};
