from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware  # CORS
from fastapi.middleware.gzip import GZipMiddleware  # gZip

from enum import Enum

import sqlite3
from datetime import datetime

class ParameterName(str, Enum):
    co = "co"
    no2 = "no2"
    no = "no"
    pm10 = "pm10"
    pm25 = "pm25"

app = FastAPI()

app.add_middleware(GZipMiddleware, minimum_size=1000)  # gZip

origins = [ # CORS
    "*",
]

app.add_middleware(  # CORS
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_LOCATION = "./db.sqlite"

con = sqlite3.connect(DB_LOCATION)
con.row_factory
cur = con.cursor()


@app.get("/")
async def root():
    return "Hello World!"

@app.get("/parameters")
async def get_parameters():
    """Возращает доступные показатели
    """

    cur.execute(
        """SELECT   
                parameter_id,
                parameter_name
            FROM parameters
        """
    )

    parameters = cur.fetchall()

    return [
        {
            "parameter_id": row[0],
            "parameter_name": row[1]
        }
        for row in parameters
    ]


@app.get("/stations")
async def get_stations():
    """Возращает названия и координаты станций 
    """

    cur.execute(
        """SELECT   
                station_id,
                st_name,
                lat,
                lon
            FROM stations
        """
    )

    stations = cur.fetchall()

    return [
        {
            "station_id": row[0],
            "st_name": row[1],
            "lat": row[2],
            "lon": row[3]
        }
        for row in stations
    ]


@app.get("/stations/{parameter}/{start_datetime}/{end_datetime}")
async def get_stations_parameter_values(parameter: ParameterName, start_datetime: datetime, end_datetime: datetime):
    """Возращает значения в станциях на заданный временной интервал для выбранного показателя. Для каждого показателя приводиться список значений на каждый час
    в заданном интервале, включая `start_datetime` и не включая `end_datetime`.
    
    Использовать дату и время вида 2020-12-31T17:00
    """

    cur.execute(
        """SELECT   
                station_id,
                datetime,
                value,
                forecast
            FROM stations_all_params
            JOIN parameters ON stations_all_params.parameter = parameters.parameter_id
            WHERE parameter_name = :parameter AND datetime >= strftime('%s', :start_datetime) AND datetime < strftime('%s', :end_datetime)
        """,
        {
            "parameter": parameter,
            "start_datetime": start_datetime,
            "end_datetime": end_datetime
        }
    )

    stations_values = cur.fetchall()

    # To get measured when possible
    # measured = [row for row in stations_values if not row[3]]
    # try:
    #     measured_max_datetime = max([row[1] for row in measured])
    # except:
    #     return []
    # forecast = [row for row in stations_values if row[1] > measured_max_datetime]
    # clear_stations_values = measured + forecast

    return [
        {
            "station_id": row[0],
            "datetime": row[1],
            "value": row[2],
            "forecast": row[3]
        }
        for row in stations_values
    ]


@app.get("/station/{station_id}/{start_datetime}/{end_datetime}")
async def get_one_station_values(station_id: int, start_datetime: datetime, end_datetime: datetime):
    """Возращает значения в станции на заданный временной интервал для всех показателей.
    
    Использовать дату и время вида 2020-12-31T17:00
    """

    # Long form
    # cur.execute(
    #     """SELECT
    #             datetime,
    #             parameter,
    #             value,
    #             forecast
    #         FROM stations_all_params
    #         WHERE station_id = :station_id AND datetime >= strftime('%s', :start_datetime) AND datetime < strftime('%s', :end_datetime)
    #     """,
    #     {
    #         "station_id": station_id,
    #         "start_datetime": start_datetime,
    #         "end_datetime": end_datetime
    #     }
    # )

    # one_station_values = cur.fetchall()

    # return [
    #     {
    #         "station_id": station_id,
    #         "datetime": row[0],
    #         "parameter": row[1],
    #         "value": row[2],
    #         "forecast": row[3]
    #     }
    #     for row in one_station_values
    # ]

    # Wide form
    cur.execute(
        """SELECT
                datetime,
                GROUP_CONCAT(CASE WHEN "parameter" == 1 THEN value END) as co,
                GROUP_CONCAT(CASE WHEN "parameter" == 2 THEN value END) as no2,
                GROUP_CONCAT(CASE WHEN "parameter" == 3 THEN value END) as no,
                GROUP_CONCAT(CASE WHEN "parameter" == 4 THEN value END) as pm10,
                GROUP_CONCAT(CASE WHEN "parameter" == 5 THEN value END) as pm25,
                forecast
            FROM
                stations_all_params
            WHERE
                station_id = :station_id
                AND datetime >= strftime('%s', :start_datetime)
                AND datetime < strftime('%s', :end_datetime)
            GROUP BY datetime
        """,
        {
            "station_id": station_id,
            "start_datetime": start_datetime,
            "end_datetime": end_datetime
        }
    )

    one_station_values = cur.fetchall()

    return [
        {
            "station_id": station_id,
            "datetime": row[0],
            "co": row[1],
            "no2": row[2],
            "no": row[3],
            "pm10": row[4],
            "pm25": row[5],
            "forecast": row[6]
        }
        for row in one_station_values
    ]

@app.get("/stations/dates")
async def get_stations_dates():
    """Возращает минимальную и максимальную даты, которые есть в таблице сетки.
    """

    cur.execute(
        f"""SELECT   
                MIN(datetime), MAX(datetime)
            FROM stations_all_params
     """
    )

    stations_dates = cur.fetchall()
    return(stations_dates[0])


@app.get("/basenet")
async def get_basenet_geo():
    """Возращает центры ячеек и ближайшую станцию, соответствующую каждой ячейке 
    """

    cur.execute(
        """SELECT   
                grid_id,
                lat,
                lon,
                station_id
            FROM basenet
        """
    )

    basenet = cur.fetchall()

    return [
        {
            "grid_id": row[0],
            "lat": row[1],
            "lon": row[2],
            "station_id": row[3]
        }
        for row in basenet
    ]   


@app.get("/net/{parameter}/{start_datetime}/{end_datetime}")
async def get_net_parameter_values(parameter: ParameterName, start_datetime: datetime, end_datetime: datetime):
    """Возращает значения ячеек на заданный временной интервал для выбранного показателя. Для каждого показателя приводиться список значений на каждый час
    в заданном интервале, включая `start_datetime` и не включая `end_datetime`.
    
    Использовать дату и время вида 2020-12-31T17:00 (пока есть данные только для 2020-12-31 и 2021-01-01)
    """

    cur.execute(
        """SELECT   
                grid_id,
                datetime,
                param_value,
                forecast
            FROM net_all_params
            JOIN parameters ON net_all_params.parameter = parameters.parameter_id
            WHERE parameter_name = :parameter AND datetime >= strftime('%s', :start_datetime) AND datetime < strftime('%s', :end_datetime)
        """,
        {
            "parameter": parameter,
            "start_datetime": start_datetime,
            "end_datetime": end_datetime
        }
    )

    net_values = cur.fetchall()

    # To get measured when possible
    # measured = [row for row in net_values if not row[3]]
    # try:
    #     measured_max_datetime = max([row[1] for row in measured])
    # except:
    #     []
    # forecast = [row for row in net_values if row[1] > measured_max_datetime]
    # clear_net_values = measured + forecast

    return [
        {
            "grid_id": row[0],
            "datetime": row[1],
            "value": row[2],
            "forecast": row[3]
        }
        for row in net_values
    ]

@app.get("/net/dates")
async def get_net_dates():
    """Возращает минимальную и максимальную даты, которые есть в таблице сетки.
    """

    cur.execute(
        f"""SELECT   
                MIN(datetime), MAX(datetime)
            FROM net_all_params
     """
    )

    net_dates = cur.fetchall()
    return(net_dates[0])