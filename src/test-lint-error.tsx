import React from 'react';

const TestComponent = () => {
  const x = 10;

  if (x === 10) {
    // Using strict equality
  }

  const handleClick = () => {
    // Button click handler
  };

  return (
    <div>
      <button onClick={handleClick}>Click me</button>
      {/* Missing key prop in list */}
      {[1, 2, 3].map((item) => (
        <div key={item}>{item}</div>
      ))}
    </div>
  );
};

export default TestComponent;
