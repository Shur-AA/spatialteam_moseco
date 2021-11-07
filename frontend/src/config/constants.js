import { getNextTimestamp } from "../utils/date";

export const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoieWFzZXZwbGF0b24iLCJhIjoiY2poaTJrc29jMDF0YzM2cDU1ZnM1c2xoMiJ9.FhmWdHG7ar14dQv1Aoqx4A";

export const RASTER_STYLE_TOKEN =
  "pk.eyJ1IjoiZ2Vvc2h1ciIsImEiOiJja3ZtaHFxYzUwdmpuMm9vNXM5NGF4c3h4In0.1i6rEonS-ir3dXBhz5PUEw";

export const startTimeStamp = 1609372800;
export const endTimeStamp = getNextTimestamp(startTimeStamp, 47);

export const colorRange = [
  [255, 255, 217],
  [237, 248, 177],
  [199, 233, 180],
  [127, 205, 187],
  [65, 182, 196],
  [29, 145, 192],
  [34, 94, 168],
  [37, 52, 148],
  [8, 29, 88],
];

export const DateOptions = [
  {
    "14.01.21 - 15.01.21": ["2021-01-14T00:00", "2021-01-15T23:59"],
  },
  {
    "17.01.21 - 18.01.21": ["2021-01-17T00:00", "2021-01-18T23:59"],
  },
  {
    "18.01.21 - 19.01.21": ["2021-01-18T00:00", "2021-01-19T23:59"],
  },
  {
    "08.04.21 - 09.04.21": ["2021-04-08T00:00", "2021-04-09T23:59"],
  },
  {
    "12.04.21 - 13.04.21": ["2021-04-12T00:00", "2021-04-13T23:59"],
  },
  {
    "12.07.21 - 13.07.21": ["2021-07-12T00:00", "2021-07-13T23:59"],
  },
  {
    "13.07.21 - 14.07.21": ["2021-07-13T00:00", "2021-07-14T23:59"],
  },
  {
    "26.07.21 - 27.07.21": ["2021-07-26T00:00", "2021-07-27T23:59"],
  },
  {
    "13.09.21 - 14.09.21": ["2021-09-13T00:00", "2021-09-14T23:59"],
  },
  {
    "20.09.21 - 21.09.21": ["2021-09-20T00:00", "2021-09-21T23:59"],
  },
];
