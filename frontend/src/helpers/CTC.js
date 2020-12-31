import React, { useEffect, useRef } from "react"

const useClickToClose = (closeHandler,selector) =>{
  let node = useRef();
  useEffect(() => {
         let clickHandler
         if(node.current){
            clickHandler = (e)=>{
                const element = document.querySelector(selector)
                if(element){
                    if(!element.contains(e.target)){
                        closeHandler()
                    }
                }

            }
         }
       
        
    document.addEventListener("mousedown", clickHandler);

    return () => {
      document.removeEventListener("mousedown", clickHandler);
    };

  });

  return node;
}

export  {useClickToClose};