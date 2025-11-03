/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

export default function EventObject() {
  const [event, setEvent] = useState<any>(null);
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const eventCopy = {
      ...e,
      target: e.target instanceof HTMLElement ? e.target.outerHTML : null,
      view: undefined
    };
    setEvent(eventCopy);
  };
  
  return (
    <div>
      <h2>Event Object</h2>
      <button 
        onClick={(e) => handleClick(e)}
        className="btn btn-primary"
        id="wd-display-event-obj-click"
      >
        Display Event Object
      </button>
      <pre>{JSON.stringify(event, null, 2)}</pre>
      <hr/>
    </div>
  );
}