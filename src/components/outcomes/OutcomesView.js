import React, { useState, useEffect } from 'react';
import axios from 'axios';

function OutcomesView() {
  const [psos, setPSOs] = useState([]);
  const [pos, setPOs] = useState([]);

  useEffect(() => {
    async function fetchOutcomes() {
      try {
        const response1 = await axios.get('http://localhost:5001/api/psos');
        const response2 = await axios.get('http://localhost:5001/api/pos');
        setPSOs(response1.data);
        setPOs(response2.data);
      } catch (error) {
        console.error('Error fetching PSOs and POs:', error);
      }
    }
    fetchOutcomes();
  }, []);

  return (
    <div>
      <h2>POs</h2>
      <ul>
        {pos.map(po => (
          <li key={po._id}>
            <strong>{po.name}</strong> - {po.description}
          </li>
        ))}
      </ul>
      <h2>PSOs</h2>
      <ul>
        {psos.map(pso => (
          <li key={pso._id}>
            <strong>{pso.name}</strong> - {pso.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OutcomesView;
