import React, { useEffect, useRef } from "react";

const useClickToClose = (closeHandler, x) => {
  let node = useRef();
  useEffect(() => {
    let clickHandler;
    if (node.current) {
      clickHandler = (event) => {
        if (
          !node.current.contains(event.target) &&
          !x.current.contains(event.target)
        ) {
          closeHandler();
        } else if (
          !node.current.contains(event.target) &&
          !x.current.contains(event.target)
        ) {
          closeHandler();
        }
      };
    }

    document.addEventListener("mousedown", clickHandler);

    return () => {
      document.removeEventListener("mousedown", clickHandler);
    };
  });

  return node;
};

export { useClickToClose };
