import React, { useMemo, useState, useEffect } from "react";
import MapGL, { CustomLayer, LanguageControl } from "@urbica/react-map-gl";
import { MapboxLayer } from "@deck.gl/mapbox";
import { HexagonLayer } from "@deck.gl/aggregation-layers";
import { colorRange, RASTER_STYLE_TOKEN } from "../../config/constants";
import {
  useGridCoords,
  useGridValues,
  useStationsCoords,
  useStationsValues,
} from "../../api";
import { StationsLayer } from "./stations-layer";
import { OstankinoLayer } from "./ostankino-layer";
import { useDispatch, useSelector } from "react-redux";
import {
  getPopupVisible,
  getSelectedParameter,
  getOstankinoModePeriod,
  getMode,
} from "../../root-slice/root-selectors";
import { getMatchedData, toGeoJSON } from "./utils";
import CircularProgress from "@mui/material/CircularProgress";
import styles from "./map.module.scss";
import { MapPopup } from "../map-popup";
import {
  setPopup,
  BASE_MODE,
  OSTANKINO_MODE,
} from "../../root-slice/root-slice";

export const MapComponent = () => {
  const [viewport, setViewport] = useState({
    latitude: 55.7558,
    longitude: 37.6173,
    zoom: 9,
  });

  const param = useSelector(getSelectedParameter);
  const popupVisible = useSelector(getPopupVisible);
  const ostPeriod = useSelector(getOstankinoModePeriod);
  const mode = useSelector(getMode);
  const isBaseMode = mode === BASE_MODE;

  useEffect(() => {
    if (mode === OSTANKINO_MODE) {
      setViewport({
        latitude: 55.82453796219977,
        longitude: 37.593348127013456,
        zoom: 11.211566615946861,
      });
    } else {
      setViewport({
        latitude: 55.7558,
        longitude: 37.6173,
        zoom: 9,
      });
    }
  }, [mode]);

  const { data: gridCoords } = useGridCoords();
  const { data: stationsCoords } = useStationsCoords();

  const dispatch = useDispatch();

  const stationsGeoJSON = useMemo(() => {
    if (!stationsCoords) return;

    return toGeoJSON(stationsCoords);
  }, [stationsCoords]);

  const { data: stationsValues, isLoading: isStationsLoading } =
    useStationsValues(!!param);
  const { data: gridValues, isLoading: isGridLoading } = useGridValues(!!param);

  const matchedStations = useMemo(() => {
    if (!stationsCoords || !stationsValues) return;

    return getMatchedData(stationsCoords, stationsValues, true);
  }, [stationsCoords, stationsValues]);

  const matchedGrid = useMemo(() => {
    if (!gridCoords || !gridValues) return;

    return getMatchedData(gridCoords, gridValues);
  }, [gridCoords, gridValues]);

  const isDataLoading = useMemo(
    () => isStationsLoading || isGridLoading,
    [isStationsLoading, isGridLoading]
  );

  const gridLayer = useMemo(() => {
    if (!matchedGrid) return;

    return new MapboxLayer({
      id: "grid",
      type: HexagonLayer,
      data: matchedGrid,
      pickable: true,
      radius: 600,
      onClick: (item) => {
        const [lon, lat] = item.coordinate;
        dispatch(
          setPopup({
            layer: "grid",
            lon,
            lat,
            data: item.object,
          })
        );
      },
      opacity: 0.5,
      colorRange: colorRange,
      getPosition: (d) => [d.lon, d.lat],
      getColorValue: (points) =>
        points.reduce((sum, p) => (sum += p.value), 0) / points.length,
    });
  }, [matchedGrid, dispatch]);

  const ostankinoData =
    stationsGeoJSON &&
    stationsGeoJSON.features.find(
      ({ properties }) => properties.station_id === 6
    );

  return (
    <MapGL
      style={{ width: "100vw", height: "100vh", position: "relative" }}
      mapStyle={
        isBaseMode
          ? "mapbox://styles/mapbox/light-v9"
          : "mapbox://styles/geoshur/ckvoc2mkp19hb14ph6lnpvg95"
      }
      accessToken={RASTER_STYLE_TOKEN}
      latitude={viewport.latitude}
      longitude={viewport.longitude}
      zoom={viewport.zoom}
      onViewportChange={setViewport}
    >
      <LanguageControl defaultLanguage="ru" />
      {isDataLoading && (
        <div className={styles.loadingContainer}>
          <div className={styles.loading}>
            <CircularProgress color="secondary" />
          </div>
        </div>
      )}

      {stationsGeoJSON &&
        (isBaseMode ? (
          <StationsLayer
            data={matchedStations ? matchedStations : stationsGeoJSON}
          />
        ) : (
          <OstankinoLayer data={ostankinoData} />
        ))}

      {gridLayer && isBaseMode && (
        <CustomLayer layer={gridLayer} before="stations" />
      )}
      {(param || (!isBaseMode && !!ostPeriod)) && popupVisible && <MapPopup />}
    </MapGL>
  );
};
