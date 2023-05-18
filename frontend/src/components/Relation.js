import React, { useEffect, useState } from "react";

const Relation = ({ id1, id2, left, index }) => {
  const colors = [
    "#16c79a",
    "#19456b",
    "#11698e",
    "#e7d9ea",
    "#583d72",
    "#fa9579",
    "#fdb827",
    "#bedbbb",
    "#839b97",
  ];
  const random_color = colors[Math.floor(Math.random() * colors.length)];
  const [random, setRandome] = useState();
  useEffect(() => {
    setRandome(colors[Math.floor(Math.random() * colors.length)]);
  }, []);
  const [x1, setX1] = useState();
  const [y1, sety1] = useState();

  let box1, box2;

  useEffect(() => {
    const element1 = document.getElementById(id1);
    const element2 = document.getElementById(id2);
    if ((element1, element2)) {
      box1 = element1?.getBoundingClientRect();
      box2 = element2?.getBoundingClientRect();
      sety1(box2.y - box1.y);
      setX1(box2.x - (box1.x + box1.width));
    }
  }, [x1, index]);

  return (
    <>
      {y1 > 0 ? (
        <svg className='draw' style={{ left: left + "px" }}>
          <polyline
            points={`0,0 0,${y1} ${x1 + left},${y1}`}
            fill='none'
            strokeWidth='4'
            stroke={random}
          />
        </svg>
      ) : (
        <svg className='drawv2' style={{ left: left + "px" }}>
          <polyline
            points={`0,600 25,600 25,${600 + y1} ${x1},${600 + y1}`}
            fill='none'
            strokeWidth='4'
            stroke={random}
          />
        </svg>
      )}
    </>
  );
};

export default Relation;
