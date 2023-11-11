import { Chart, ChartItem } from "chart.js/auto";
import { fromUnixTime, parse, parseISO } from "date-fns";
import "chartjs-adapter-date-fns";

const left = document.getElementById("leftEye");
const right = document.getElementById("rightEye");
const aux = document.getElementById("aux");
const hr = document.getElementById("heartRate");
const imu = document.getElementById("imu");

let charts: any[] = [];

async function render(id: string) {
  const afe = await fetch(`/${id}/AFE.json`).then((res) => res.json());
  const imuData = await fetch(`/${id}/IMU.json`).then((res) => res.json());

  charts.forEach((chart) => chart.destroy());
  charts = [];
  charts.push(
    new Chart(left as any, {
      type: "line",
      data: {
        datasets: [...eyeData(afe, 0, "Left")],
      },
      options: {
        scales: {
          x: {
            type: "timeseries",
            time: {
              unit: "second",
            },
          },
        },
      },
    })
  );

  charts.push(
    new Chart(right as any, {
      type: "line",
      data: {
        datasets: [...eyeData(afe, 1, "Right")],
      },
      options: {
        scales: {
          x: {
            type: "timeseries",
            time: {
              unit: "second",
            },
          },
        },
      },
    })
  );

  charts.push(
    new Chart(aux as any, {
      type: "line",
      data: {
        datasets: [...auxData(afe)],
      },
      options: {
        scales: {
          x: {
            type: "timeseries",
            time: {
              unit: "second",
            },
          },
        },
      },
    })
  );

  charts.push(
    new Chart(imu as any, {
      type: "line",
      data: {
        datasets: [
          {
            label: `Accelerometer X`,
            data: imuData.map((entry) => ({
              x: fromUnixTime(Math.floor(entry.i[1] / 1000000)),
              y: entry.v[0],
            })),
          },
          {
            label: `Accelerometer Y`,
            data: imuData.map((entry) => ({
              x: fromUnixTime(Math.floor(entry.i[1] / 1000000)),
              y: entry.v[1],
            })),
          },
          {
            label: `Accelerometer Z`,
            data: imuData.map((entry) => ({
              x: fromUnixTime(Math.floor(entry.i[1] / 1000000)),
              y: entry.v[2],
            })),
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: "timeseries",
            time: {
              unit: "second",
            },
          },
        },
      },
    })
  );
}

function eyeData(afe: any[], eye: number, name: string) {
  return [0, 1, 2, 3, 4, 5].map((i) => {
    return {
      label: `${name} eye #${i}`,
      data: afe.map((entry) => ({
        x: fromUnixTime(Math.floor(entry.afe[eye].i[1] / 1000000)),
        y: entry.afe[eye].m[0][i],
      })),
    };
  });
}

function auxData(afe: any[]) {
  return [0, 1, 2, 3].map((i) => {
    return {
      label: `Aux #${i}`,
      data: afe.map((entry) => ({
        x: fromUnixTime(
          Math.floor(entry.auxSensors.lightAmbient.i[1] / 1000000)
        ),
        y: entry.auxSensors.lightAmbient.v[i],
      })),
    };
  });
}

let heartRate = [
  { x: "2023-11-10T21:12:12Z", y: 74 },
  { x: "2023-11-10T21:12:58Z", y: 70 },
  { x: "2023-11-10T21:20:59Z", y: 66 },
  { x: "2023-11-10T21:23:29Z", y: 74 },
  { x: "2023-11-10T21:28:30Z", y: 65 },
  { x: "2023-11-10T21:35:09Z", y: 68 },
  { x: "2023-11-10T21:40:12Z", y: 69 },
  { x: "2023-11-10T21:43:32Z", y: 68 },
  { x: "2023-11-10T21:49:09Z", y: 71 },
  { x: "2023-11-10T21:53:05Z", y: 91 },
  { x: "2023-11-10T21:59:27Z", y: 93 },
  { x: "2023-11-11T22:06:29Z", y: 111 },
  { x: "2023-11-11T22:06:30Z", y: 109 },
  { x: "2023-11-11T22:07:27Z", y: 110 },
  { x: "2023-11-11T22:08:11Z", y: 99 },
  { x: "2023-11-11T22:13:03Z", y: 95 },
  { x: "2023-11-11T22:23:03Z", y: 79 },
  { x: "2023-11-11T22:28:53Z", y: 73 },
  { x: "2023-11-11T22:39:05Z", y: 77 },
].map((entry) => ({
  x: parseISO(entry.x),
  y: entry.y,
}));

new Chart(hr as any, {
  type: "line",
  data: {
    datasets: [
      {
        label: `Heartrate`,
        data: heartRate,
      },
    ],
  },
  options: {
    scales: {
      x: {
        type: "timeseries",
        time: {
          unit: "second",
        },
      },
    },
  },
});

addEventListener("hashchange", (event) => {
  render(location.hash.slice(1));
});

render("1");
