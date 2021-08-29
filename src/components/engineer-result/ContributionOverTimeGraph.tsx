import React, { useEffect, useMemo } from 'react';
import { ResponsiveLine, Serie } from '@nivo/line';
import moment from 'moment';
import { FullReportQueryResult } from '../../github/fullReportQuery';

const ONE_WEEK_MS = 24 * 60 * 60 * 1000;

interface TimeValueGraphProps {
  data: FullReportQueryResult;
}

const getSeries = (data: FullReportQueryResult) => {
  const series: Serie[] = [];
  const datesAndCountsPerWeek = data.pullRequests.nodes.reduce((prev, curr) => {
    const startOfWeek = moment(curr.createdAt).startOf('week').toDate();
    if (prev.length === 0 || +startOfWeek !== +prev[prev.length - 1].x) {
      return [
        ...prev,
        {
          x: startOfWeek,
          y: 1,
        },
      ];
    }

    const firstPart = prev.slice(0, prev.length - 1);
    const lastObj = prev[firstPart.length];
    return [
      ...firstPart,
      {
        ...lastObj,
        y: lastObj.y + 1,
      },
    ];
  }, []);

  const issuesDatesAndCounts = data.issues.nodes.reduce((prev, curr) => {
    const startOfWeek = moment(curr.createdAt).startOf('week').toDate();
    if (prev.length === 0 || +startOfWeek !== +prev[prev.length - 1].x) {
      return [
        ...prev,
        {
          x: startOfWeek,
          y: 1,
        },
      ];
    }

    const firstPart = prev.slice(0, prev.length - 1);
    const lastObj = prev[firstPart.length];
    return [
      ...firstPart,
      {
        ...lastObj,
        y: lastObj.y + 1,
      },
    ];
  }, []);

  const issueCommentsDatesCounts = data.issueComments.nodes
    .filter((node) => !node.pullRequest)
    .reduce((prev, curr) => {
      const startOfWeek = moment(curr.createdAt).endOf('week').toDate();
      if (prev.length === 0 || +startOfWeek !== +prev[prev.length - 1].x) {
        return [
          ...prev,
          {
            x: startOfWeek,
            y: 1,
          },
        ];
      }

      const firstPart = prev.slice(0, prev.length - 1);
      const lastObj = prev[firstPart.length];
      return [
        ...firstPart,
        {
          ...lastObj,
          y: lastObj.y + 1,
        },
      ];
    }, []);

  const prComments = data.issueComments.nodes
    .filter((node) => !!node.pullRequest)
    .reduce((prev, curr) => {
      const startOfWeek = moment(curr.createdAt).startOf('week').toDate();
      if (prev.length === 0 || +startOfWeek !== +prev[prev.length - 1].x) {
        return [
          ...prev,
          {
            x: startOfWeek,
            y: 1,
          },
        ];
      }

      const firstPart = prev.slice(0, prev.length - 1);
      const lastObj = prev[firstPart.length];
      return [
        ...firstPart,
        {
          ...lastObj,
          y: lastObj.y + 1,
        },
      ];
    }, []);

  series.push(
    {
      id: 'Pull requests',
      data: datesAndCountsPerWeek,
    },
    {
      id: 'Issues created',
      data: issuesDatesAndCounts,
    },
    {
      id: 'Issue comments',
      data: issueCommentsDatesCounts,
    },
    {
      id: 'PR Comments',
      data: prComments,
    }
  );

  return series;
};

function ContributionOverTimeGraph({ data }: TimeValueGraphProps) {
  const seriesData = useMemo(() => getSeries(data), [data]);
  return (
    <div style={{ height: '280px' }}>
      <ResponsiveLine
        data={seriesData}
        xScale={{
          type: 'time',
          format: 'native',
          precision: 'day',
        }}
        //animate={true}
        enableSlices="x"
        enablePointLabel={true}
        margin={{ top: 20, right: 150, bottom: 60, left: 80 }}
        axisBottom={{
          format: (d) => moment(d).format('MMM D'),
        }}
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
            effects: [
              {
                on: 'hover',
                style: {
                  itemBackground: 'rgba(0, 0, 0, .03)',
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
}

export default ContributionOverTimeGraph;
