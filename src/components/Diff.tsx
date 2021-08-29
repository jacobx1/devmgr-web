import React from 'react';

export function Added({ added }) {
  return <span style={{ color: 'green' }}>+{added}</span>;
}

export function Removed({ removed }) {
  return <span style={{ color: 'red' }}>-{removed}</span>;
}

export default function Diff({ added, removed }) {
  return (
    <React.Fragment>
      <Added added={added} /> <Removed removed={removed} />
    </React.Fragment>
  );
}
