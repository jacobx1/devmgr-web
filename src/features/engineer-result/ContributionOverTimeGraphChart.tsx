import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import { FullReportQueryResult } from '../github/fullReportQuery';

function movingAvg(array, count, qualifier) {
  // calculate average for subarray
  var avg = function (array, qualifier) {
    var sum = 0,
      count = 0,
      val;
    for (var i in array) {
      val = array[i];
      if (!qualifier || qualifier(val)) {
        sum += val;
        count++;
      }
    }

    return sum / count;
  };

  var result = [],
    val;

  // pad beginning of result with null values
  for (var i = 0; i < count - 1; i++) result.push(null);

  // calculate average for each subarray and add to result
  for (var i = 0, len = array.length - count; i <= len; i++) {
    val = avg(array.slice(i, i + count), qualifier);
    if (isNaN(val)) result.push(null);
    else result.push(val);
  }

  return result;
}

const createdAtByWeekReducer = (extractor) => (prev, curr) => {
  console.log(curr.createdAt);
  const startOfWeekMoment = moment(curr.createdAt).startOf('week');
  console.log(startOfWeekMoment);
  const startOfWeek = startOfWeekMoment.toDate();
  const previousBatch = prev[prev.length - 1];
  if (previousBatch === undefined) {
    return [
      ...prev,
      {
        x: startOfWeek,
        y: extractor(curr),
      },
    ];
  }
  let pad = [];
  const weekDiff = startOfWeekMoment.diff(previousBatch.x, 'weeks');
  if (weekDiff === 1) {
    return [
      ...prev,
      {
        x: startOfWeek,
        y: extractor(curr),
      },
    ];
  }
  if (weekDiff > 1) {
    let dateIterator = moment(previousBatch.x);
    for (let idx = 0; idx < weekDiff - 1; ++idx) {
      dateIterator = dateIterator.add(1, 'week');
      pad.push({
        x: dateIterator.toDate(),
        y: 0,
      });
    }

    return [
      ...prev,
      ...pad,
      {
        x: startOfWeek,
        y: extractor(curr),
      },
    ];
  }

  const firstPart = prev.slice(0, prev.length - 1);
  const lastObj = prev[firstPart.length];
  return [
    ...firstPart,
    {
      ...lastObj,
      y: lastObj.y + extractor(curr),
    },
  ];
};

interface TimeValueGraphProps {
  data: FullReportQueryResult;
}

const normalizeDatesForSeries = (series: Chart.ChartDataSets[]) => {
  const minDate = series.reduce(
    (prev, curr) => Math.min(prev, +curr.data[0]['x']),
    Infinity
  );
  const maxDate = series.reduce(
    (prev, curr) => Math.max(prev, +curr.data[curr.data.length - 1]['x']),
    -Infinity
  );

  for (const data of series) {
    const lowDate = data.data[0]['x'];
    const highDate = data.data[data.data.length - 1]['x'];
    const lowPad = [];
    const highPad = [];
    if (+lowDate > minDate) {
      const lowDiff = moment(lowDate).diff(minDate, 'week');
      const lowIterator = moment(minDate);
      for (let i = 0; i < lowDiff; ++i) {
        lowPad.push({
          x: lowIterator.toDate(),
          y: 0,
        });
        lowIterator.add(1, 'week');
      }
    }
    if (+highDate < maxDate) {
      const highDiff = moment(maxDate).diff(highDate, 'week');
      const highIterator = moment(highDate);
      for (let i = 0; i < highDiff; ++i) {
        highIterator.add(1, 'week');
        highPad.push({
          x: highIterator.toDate(),
          y: 0,
        });
      }
    }

    data.data = [...lowPad, ...data.data, ...highPad];
  }
};

const getSeries = (data: FullReportQueryResult) => {
  const series: Chart.ChartDataSets[] = [];
  const seriesReducer = createdAtByWeekReducer(() => 1);
  const datesAndCountsPerWeek = data.pullRequests.nodes.reduce(
    seriesReducer,
    []
  );

  const issuesDatesAndCounts = data.issues.nodes.reduce(seriesReducer, []);

  const issueCommentsDatesCounts = data.issueComments.nodes
    .filter((node) => !node.pullRequest)
    .reduce(seriesReducer, []);

  const prComments = data.issueComments.nodes
    .filter((node) => !!node.pullRequest)
    .reduce(seriesReducer, []);

  series.push(
    {
      label: 'Pull requests',
      data: datesAndCountsPerWeek,
      backgroundColor: '#28a745',
      stack: 'contributions',
    },
    {
      label: 'Issues created',
      data: issuesDatesAndCounts,
      backgroundColor: '#17a2b8',
      stack: 'contributions',
    },
    {
      label: 'Issue comments',
      data: issueCommentsDatesCounts,
      backgroundColor: '#007bff',
      stack: 'contributions',
    },
    {
      label: 'PR Comments',
      data: prComments,
      backgroundColor: '#20c997',
      stack: 'contributions',
    }
  );

  normalizeDatesForSeries(series);

  return series;
};

const getAverages = (data: Chart.ChartDataSets[]) => {
  return data.map((item) => {
    const movingAverage = movingAvg(
      (item.data as any[]).map((point) => point.y),
      4,
      () => true
    );
    const averagedData = movingAverage.map((avg, index) => ({
      x: item.data[index]['x'],
      y: avg,
    }));

    return {
      ...item,
      label: item.label + ' 4 wk average',
      data: averagedData,
    };
  });
};

const locData = (data: FullReportQueryResult) => {
  const deletionsByWeek = data.pullRequests.nodes.reduce(
    createdAtByWeekReducer((node) => node.deletions),
    []
  );
  const additionsByWeek = data.pullRequests.nodes.reduce(
    createdAtByWeekReducer((node) => node.additions),
    []
  );

  const series: Chart.ChartDataSets[] = [
    {
      label: 'Deletions',
      data: deletionsByWeek,
      backgroundColor: '#dc3545',
    },
    {
      label: 'Additions',
      data: additionsByWeek,
      backgroundColor: '#28a745',
    },
  ];

  normalizeDatesForSeries(series);
  return series;
};

function ContributionOverTimeGraph({ data }: TimeValueGraphProps) {
  const seriesData = useMemo(() => getSeries(data), [data]);
  const averagedSeriesData = useMemo(
    () => getAverages(seriesData),
    [seriesData]
  );
  const locDataResult = useMemo(() => locData(data), [data]);
  const locDataAverages = useMemo(
    () => getAverages(locDataResult),
    [locDataResult]
  );
  return (
    <>
      <div style={{ height: '200px', position: 'relative' }}>
        <Line
          data={{
            datasets: seriesData,
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            spanGaps: true,
            tooltips: {
              mode: 'index',
            },
            scales: {
              xAxes: [
                {
                  type: 'time',
                  time: {
                    unit: 'week',
                  },
                },
              ],

              yAxes: [
                {
                  stacked: true,
                  offset: true,
                },
              ],
            },
          }}
        />
      </div>
      <div style={{ height: '200px', position: 'relative' }}>
        <Line
          data={{
            datasets: averagedSeriesData,
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            spanGaps: true,
            tooltips: {
              mode: 'index',
            },
            scales: {
              xAxes: [
                {
                  type: 'time',
                  time: {
                    unit: 'week',
                  },
                },
              ],

              yAxes: [
                {
                  stacked: true,
                  offset: true,
                },
              ],
            },
          }}
        />
      </div>
      <div style={{ height: '200px', position: 'relative' }}>
        <Line
          data={{
            datasets: locDataResult,
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            spanGaps: true,
            tooltips: {
              mode: 'index',
            },
            scales: {
              xAxes: [
                {
                  type: 'time',
                  time: {
                    unit: 'week',
                  },
                },
              ],

              yAxes: [
                {
                  stacked: true,
                  offset: true,
                },
              ],
            },
          }}
        />
      </div>
      <div style={{ height: '200px', position: 'relative' }}>
        <Line
          data={{
            datasets: locDataAverages,
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            spanGaps: true,
            tooltips: {
              mode: 'index',
            },
            scales: {
              xAxes: [
                {
                  type: 'time',
                  time: {
                    unit: 'week',
                  },
                },
              ],

              yAxes: [
                {
                  stacked: true,
                  offset: true,
                },
              ],
            },
          }}
        />
      </div>
    </>
  );
}

export default ContributionOverTimeGraph;
