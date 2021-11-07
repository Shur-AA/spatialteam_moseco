import { createSlice } from "@reduxjs/toolkit";
import { startTimeStamp } from "../config/constants";

export const BASE_MODE = "base";
export const OSTANKINO_MODE = "ostankino";

const initialState = {
  parameter: "",
  mode: BASE_MODE,
  timestampStart: startTimeStamp,
  popupInfo: {
    layer: "",
    lat: 0,
    lon: 0,
    data: null,
  },
  popupVisible: false,
  ostankinoModePeriod: "",
};

export const rootSlice = createSlice({
  name: "root",
  initialState,
  reducers: {
    setParameter: (state, action) => {
      const { payload } = action;

      state.parameter = payload;
      state.popupVisible = false;
    },

    setTimestampStart: (state, action) => {
      const { payload } = action;

      state.timestampStart = payload;
      state.popupVisible = false;
    },

    setPopup: (state, action) => {
      const { payload } = action;

      const { layer, lat, lon, data } = payload;
      state.popupInfo = {
        layer,
        lat,
        lon,
        data,
      };
      state.popupVisible = true;
    },

    closePopup: (state) => {
      state.popupVisible = false;
      state.popupInfo = initialState.popupInfo;
    },

    setMode: (state, action) => {
      const { payload } = action;
      state.mode = payload;
    },

    setOstankinoModePeriod: (state, action) => {
      const { payload } = action;
      state.ostankinoModePeriod = payload;
    },
  },
});

export const {
  setParameter,
  setTimestampStart,
  setPopup,
  closePopup,
  setMode,
  setOstankinoModePeriod,
} = rootSlice.actions;

export const rootReducer = rootSlice.reducer;
