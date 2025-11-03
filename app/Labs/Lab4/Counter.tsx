import { useState } from "react";
export default function Counter() {
  const [count, setCount] = useState(7);
  console.log(count);
  return (
    <div id="wd-counter-use-state">
      <h2>Counter: {count}</h2>
      <button
        onClick={() => setCount(count + 1)}
        className="btn btn-success me-3">Up</button>
      <button
        onClick={() => setCount(count - 1)}
        className="btn btn-danger">Down</button>
<hr/></div>);}