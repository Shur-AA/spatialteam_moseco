import { Popup } from "@urbica/react-map-gl";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import ClickAwayListener from "react-click-away-listener";
import { getPopupInfo } from "../../root-slice/root-selectors";
import { closePopup } from "../../root-slice/root-slice";
import { StationPopup } from "../station-popup";

export const MapPopup = () => {
  const popupInfo = useSelector(getPopupInfo);
  const { lat, lon, layer, data } = popupInfo;
  const dispatch = useDispatch();

  const onClosePopup = useCallback(() => {
    dispatch(closePopup());
  }, [dispatch]);

  return (
    <Popup
      longitude={lon}
      latitude={lat}
      closeButton={false}
      closeOnClick={false}
      maxWidth={"600px"}
    >
      <ClickAwayListener onClickAway={onClosePopup}>
        <div>
          {layer === "grid" ? (
            <div>{`${data.colorValue?.toFixed(3)} мг/м3`}</div>
          ) : (
            <StationPopup stationId={data} />
          )}
        </div>
      </ClickAwayListener>
    </Popup>
  );
};
