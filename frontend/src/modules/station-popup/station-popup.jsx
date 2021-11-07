import { Chart, MultiChart } from "../../components/chart";
import { withLoading } from "../withLoading";
import { useStationData, useStationPeriodData } from "../../api";
import styles from "./station-popup.module.scss";
import { useSelector } from "react-redux";
import { getSelectedParameter, getMode } from "../../root-slice/root-selectors";
import { BASE_MODE } from "../../root-slice/root-slice";

const AsyncChart = withLoading(Chart);
const AsyncMultyChart = withLoading(MultiChart);

export const StationPopup = ({ stationId }) => {
  const { data, status } = useStationData(stationId, !!stationId);
  const { data: ostData, status: ostStatus } = useStationPeriodData(stationId);
  const param = useSelector(getSelectedParameter);
  const mode = useSelector(getMode);

  return (
    <div className={styles.container}>
      {mode === BASE_MODE ? (
        <AsyncChart status={status} data={data} YLabel={`${param}, мг/м3`} />
      ) : (
        <AsyncMultyChart status={ostStatus} data={ostData} />
      )}
    </div>
  );
};
