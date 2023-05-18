import React from "react";

const Node = ({ index, setIndex, zoom }) => {
  return (
    <div
      index={index}
      className='node'
      onDragOver={(e) => setIndex(e.target.attributes.index.value)}
      style={{ width: zoom * 20 + "px" }}
    ></div>
  );
};

export default Node;
