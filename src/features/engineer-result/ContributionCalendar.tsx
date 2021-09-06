import React from 'react';
import { FullReportQueryResult } from '../github/fullReportQuery';

export default function ContributionCalendar({
  data,
}: {
  data: FullReportQueryResult;
}) {
  return (
    <div>
      {data.contributionsCollection.contributionCalendar.weeks.map(
        (week, weekIdx) => {
          return (
            <div
              style={{
                display: 'inline-block',
                height: '100%',
              }}
              key={weekIdx}
            >
              {week.contributionDays.map((day, dayIdx) => {
                console.log(day.color);
                return (
                  <div
                    style={{
                      backgroundColor: day.color,
                      color: '#fff',
                      padding: '0.2em',
                      width: '24px',
                      textAlign: 'center',
                    }}
                    key={dayIdx}
                    title={day.date}
                  >
                    {day.contributionCount}
                  </div>
                );
              })}
            </div>
          );
        }
      )}
    </div>
  );
}
