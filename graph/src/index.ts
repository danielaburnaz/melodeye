import { Chart } from "chart.js/auto";
import { fromUnixTime, parseISO } from "date-fns";
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
            data: reduceData(
              imuData.map((entry) => ({
                x: fromUnixTime(Math.floor(entry.i[1] / 1000000)),
                y: entry.v[0],
              }))
            ),
          },
          {
            label: `Accelerometer Y`,
            data: reduceData(
              imuData.map((entry) => ({
                x: fromUnixTime(Math.floor(entry.i[1] / 1000000)),
                y: entry.v[1],
              }))
            ),
          },
          {
            label: `Accelerometer Z`,
            data: reduceData(
              imuData.map((entry) => ({
                x: fromUnixTime(Math.floor(entry.i[1] / 1000000)),
                y: entry.v[2],
              }))
            ),
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
  charts.push(
    new Chart(hr as any, {
      type: "line",
      data: {
        datasets: [
          {
            label: `HR`,
            data: heartRate,
          },
        ],
      },
      options: {
        plugins: {},
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
      data: reduceData(
        afe.map((entry) => ({
          x: fromUnixTime(Math.floor(entry.afe[eye].i[1] / 1000000)),
          y: entry.afe[eye].m[0][i],
        }))
      ),
    };
  });
}

function reduceData(data: any[]) {
  const seen = new Set();
  const filtered = [] as any[];
  data.forEach((d) => {
    if (!seen.has(d.x.getTime())) {
      seen.add(d.x.getTime());
      filtered.push(d);
    }
  });
  return filtered;
}

function auxData(afe: any[]) {
  return ["UV 1", "UV 0", "Ambient Light", "IR 0"].map((name, idx) => {
    return {
      label: `${name}`,
      data: reduceData(
        afe.map((entry) => ({
          x: fromUnixTime(
            Math.floor(entry.auxSensors.lightAmbient.i[1] / 1000000)
          ),
          y: entry.auxSensors.lightAmbient.v[idx],
        }))
      ),
    };
  });
}

let heartRate = [
  { x: "2023-11-11T22:08:33Z", y: 94 },
  { x: "2023-11-11T22:08:34Z", y: 91 },
  { x: "2023-11-11T22:08:35Z", y: 95 },
  { x: "2023-11-11T22:08:36Z", y: 93 },
  { x: "2023-11-11T22:08:37Z", y: 95 },
  { x: "2023-11-11T22:08:38Z", y: 96 },
  { x: "2023-11-11T22:08:39Z", y: 93 },
  { x: "2023-11-11T22:08:40Z", y: 98 },
  { x: "2023-11-11T22:08:41Z", y: 99 },
  { x: "2023-11-11T22:08:42Z", y: 102 },
  { x: "2023-11-11T22:08:43Z", y: 106 },
  { x: "2023-11-11T22:08:44Z", y: 103 },
  { x: "2023-11-11T22:08:45Z", y: 106 },
  { x: "2023-11-11T22:08:46Z", y: 106 },
  { x: "2023-11-11T22:08:47Z", y: 104 },
  { x: "2023-11-11T22:08:48Z", y: 100 },
  { x: "2023-11-11T22:08:49Z", y: 98 },
  { x: "2023-11-11T22:08:50Z", y: 99 },
  { x: "2023-11-11T22:08:51Z", y: 97 },
  { x: "2023-11-11T22:08:52Z", y: 96 },
  { x: "2023-11-11T22:08:53Z", y: 98 },
  { x: "2023-11-11T22:08:54Z", y: 98 },
  { x: "2023-11-11T22:08:55Z", y: 99 },
  { x: "2023-11-11T22:08:56Z", y: 102 },
  { x: "2023-11-11T22:08:57Z", y: 97 },
  { x: "2023-11-11T22:08:58Z", y: 101 },
  { x: "2023-11-11T22:08:59Z", y: 102 },
  { x: "2023-11-11T22:09:00Z", y: 106 },
  { x: "2023-11-11T22:09:01Z", y: 110 },
  { x: "2023-11-11T22:09:02Z", y: 108 },
  { x: "2023-11-11T22:09:03Z", y: 112 },
  { x: "2023-11-11T22:09:04Z", y: 110 },
  { x: "2023-11-11T22:09:05Z", y: 105 },
  { x: "2023-11-11T22:09:06Z", y: 101 },
  { x: "2023-11-11T22:09:07Z", y: 100 },
  { x: "2023-11-11T22:09:08Z", y: 101 },
  { x: "2023-11-11T22:09:09Z", y: 98 },
  { x: "2023-11-11T22:09:10Z", y: 96 },
  { x: "2023-11-11T22:09:11Z", y: 101 },
  { x: "2023-11-11T22:09:12Z", y: 101 },
  { x: "2023-11-11T22:09:13Z", y: 101 },
  { x: "2023-11-11T22:09:14Z", y: 104 },
  { x: "2023-11-11T22:09:15Z", y: 101 },
  { x: "2023-11-11T22:09:16Z", y: 103 },
  { x: "2023-11-11T22:09:17Z", y: 104 },
  { x: "2023-11-11T22:09:18Z", y: 108 },
  { x: "2023-11-11T22:09:19Z", y: 109 },
  { x: "2023-11-11T22:09:20Z", y: 105 },
  { x: "2023-11-11T22:09:21Z", y: 110 },
  { x: "2023-11-11T22:09:22Z", y: 105 },
  { x: "2023-11-11T22:09:23Z", y: 101 },
  { x: "2023-11-11T22:09:24Z", y: 98 },
  { x: "2023-11-11T22:09:25Z", y: 98 },
  { x: "2023-11-11T22:09:26Z", y: 98 },
  { x: "2023-11-11T22:09:27Z", y: 94 },
  { x: "2023-11-11T22:09:28Z", y: 91 },
  { x: "2023-11-11T22:09:29Z", y: 92 },
  { x: "2023-11-11T22:09:30Z", y: 89 },
  { x: "2023-11-11T22:09:31Z", y: 92 },
  { x: "2023-11-11T22:09:32Z", y: 92 },
  { x: "2023-11-11T22:09:33Z", y: 87 },
  { x: "2023-11-11T22:09:34Z", y: 90 },
  { x: "2023-11-11T22:09:35Z", y: 91 },
  { x: "2023-11-11T22:09:36Z", y: 95 },
  { x: "2023-11-11T22:09:37Z", y: 96 },
  { x: "2023-11-11T22:09:38Z", y: 96 },
  { x: "2023-11-11T22:09:39Z", y: 101 },
  { x: "2023-11-11T22:09:40Z", y: 98 },
  { x: "2023-11-11T22:09:41Z", y: 96 },
  { x: "2023-11-11T22:09:42Z", y: 92 },
  { x: "2023-11-11T22:09:43Z", y: 91 },
  { x: "2023-11-11T22:09:44Z", y: 96 },
  { x: "2023-11-11T22:09:45Z", y: 94 },
  { x: "2023-11-11T22:09:46Z", y: 91 },
  { x: "2023-11-11T22:09:47Z", y: 93 },
  { x: "2023-11-11T22:09:48Z", y: 88 },
  { x: "2023-11-11T22:09:49Z", y: 93 },
  { x: "2023-11-11T22:09:50Z", y: 93 },
  { x: "2023-11-11T22:09:51Z", y: 88 },
  { x: "2023-11-11T22:09:52Z", y: 88 },
  { x: "2023-11-11T22:09:53Z", y: 93 },
  { x: "2023-11-11T22:09:54Z", y: 93 },
  { x: "2023-11-11T22:09:55Z", y: 96 },
  { x: "2023-11-11T22:09:56Z", y: 91 },
  { x: "2023-11-11T22:09:57Z", y: 91 },
  { x: "2023-11-11T22:09:58Z", y: 86 },
  { x: "2023-11-11T22:09:59Z", y: 83 },
  { x: "2023-11-11T22:10:00Z", y: 83 },
  { x: "2023-11-11T22:10:01Z", y: 83 },
  { x: "2023-11-11T22:10:02Z", y: 86 },
  { x: "2023-11-11T22:10:03Z", y: 84 },
  { x: "2023-11-11T22:10:04Z", y: 83 },
  { x: "2023-11-11T22:10:05Z", y: 84 },
  { x: "2023-11-11T22:10:06Z", y: 84 },
  { x: "2023-11-11T22:10:07Z", y: 88 },
  { x: "2023-11-11T22:10:08Z", y: 89 },
  { x: "2023-11-11T22:10:09Z", y: 87 },
  { x: "2023-11-11T22:10:10Z", y: 90 },
  { x: "2023-11-11T22:10:11Z", y: 92 },
  { x: "2023-11-11T22:10:12Z", y: 93 },
  { x: "2023-11-11T22:10:13Z", y: 93 },
  { x: "2023-11-11T22:10:14Z", y: 89 },
  { x: "2023-11-11T22:10:15Z", y: 92 },
  { x: "2023-11-11T22:10:16Z", y: 90 },
  { x: "2023-11-11T22:10:17Z", y: 88 },
  { x: "2023-11-11T22:10:18Z", y: 84 },
  { x: "2023-11-11T22:10:19Z", y: 79 },
  { x: "2023-11-11T22:10:20Z", y: 81 },
  { x: "2023-11-11T22:10:21Z", y: 78 },
  { x: "2023-11-11T22:10:22Z", y: 74 },
  { x: "2023-11-11T22:10:23Z", y: 76 },
  { x: "2023-11-11T22:10:24Z", y: 76 },
  { x: "2023-11-11T22:10:25Z", y: 77 },
  { x: "2023-11-11T22:10:26Z", y: 81 },
  { x: "2023-11-11T22:10:27Z", y: 77 },
  { x: "2023-11-11T22:10:28Z", y: 77 },
  { x: "2023-11-11T22:10:29Z", y: 77 },
  { x: "2023-11-11T22:10:30Z", y: 82 },
  { x: "2023-11-11T22:10:31Z", y: 84 },
  { x: "2023-11-11T22:10:32Z", y: 84 },
  { x: "2023-11-11T22:10:33Z", y: 87 },
  { x: "2023-11-11T22:10:34Z", y: 82 },
  { x: "2023-11-11T22:10:35Z", y: 82 },
  { x: "2023-11-11T22:10:36Z", y: 78 },
  { x: "2023-11-11T22:10:37Z", y: 77 },
  { x: "2023-11-11T22:10:38Z", y: 81 },
  { x: "2023-11-11T22:10:39Z", y: 79 },
  { x: "2023-11-11T22:10:40Z", y: 77 },
  { x: "2023-11-11T22:10:41Z", y: 78 },
  { x: "2023-11-11T22:10:42Z", y: 73 },
  { x: "2023-11-11T22:10:43Z", y: 75 },
  { x: "2023-11-11T22:10:44Z", y: 76 },
  { x: "2023-11-11T22:10:45Z", y: 75 },
  { x: "2023-11-11T22:10:46Z", y: 76 },
  { x: "2023-11-11T22:10:47Z", y: 77 },
  { x: "2023-11-11T22:10:48Z", y: 77 },
  { x: "2023-11-11T22:10:49Z", y: 81 },
  { x: "2023-11-11T22:10:50Z", y: 77 },
  { x: "2023-11-11T22:10:51Z", y: 81 },
  { x: "2023-11-11T22:10:52Z", y: 77 },
  { x: "2023-11-11T22:10:53Z", y: 72 },
  { x: "2023-11-11T22:10:54Z", y: 72 },
  { x: "2023-11-11T22:10:55Z", y: 72 },
  { x: "2023-11-11T22:10:56Z", y: 76 },
  { x: "2023-11-11T22:10:57Z", y: 72 },
  { x: "2023-11-11T22:10:58Z", y: 68 },
  { x: "2023-11-11T22:10:59Z", y: 69 },
  { x: "2023-11-11T22:11:00Z", y: 68 },
].map((entry) => ({
  x: fromUnixTime(parseISO(entry.x).getTime() / 1000),
  y: entry.y,
}));

console.log(heartRate);

addEventListener("hashchange", (event) => {
  render(location.hash.slice(1));
});

function updateGraph(currentTime) {
  charts.forEach((chart) => {
    chart.config.options!.scales!["x"]!.max = Math.floor(
      chart.scales["x"].min + currentTime * 1000
    );
    chart.update();
  });
}

const video = document.getElementById("video") as HTMLVideoElement;

video.addEventListener("timeupdate", () => {
  const currentTime = video.currentTime;
  updateGraph(currentTime);
});

await render("1");
