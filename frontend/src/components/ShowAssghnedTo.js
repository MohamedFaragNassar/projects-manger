import React from "react";
import { Link } from "react-router-dom";

const ShowAssghnedTo = ({ members }) => {
  return (
    <div>
      <ul>
        {members.map((member) => (
          <Link>{member}</Link>
        ))}
      </ul>
    </div>
  );
};

export default ShowAssghnedTo;
