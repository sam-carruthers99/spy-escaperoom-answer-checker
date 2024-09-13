import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const puzzleData = [
  { number: 1, solutionLength: 4, type: 'text' },
  { number: 2, solutionLength: 10, type: 'text' },
  { number: 3, solutionLength: 4, type: 'text' },
  { number: 4, solutionLength: 8, type: 'text' },
  { number: 5, solutionLength: 4, type: 'text' },
  { number: 6, solutionLength: 7, type: 'text' },
  { number: 7, solutionLength: 3, type: 'text' },
  { number: 8, solutionLength: 0, type: 'traditional' }, // Traditional input box
];

const puzzleSolution = [
    { 1: 'SAVE' },
    { 2: 'NIGHTSHADE' },
    { 3: '1111' },
    { 4: 'SECURITY' },
    { 5: '2579' },
    { 6: 'STEALTH' },
    { 7: '495' },
    { 8: 'BWBB329214057' }
];

const submitClicked = () => { 
    // Get the input from the separate input boxes
}

const Puzzle = ({ puzzleNumber }) => {
  const [hintVisible, setHintVisible] = useState(false);
  const puzzle = puzzleData[puzzleNumber - 1];
  const inputRefs = useRef([]);

  const handleInputChange = (e, idx) => {
    const value = e.target.value;
    if (value.length === 1 && idx < puzzle.solutionLength - 1) {
      inputRefs.current[idx + 1].focus(); // Auto-focus next box
    }
  };

  const renderInputBoxes = () => {
    if (puzzle.type === 'traditional') {
      return <input className="traditional-input" type="text" />;
    } else {
      return [...Array(puzzle.solutionLength)].map((_, idx) => (
        <input
          key={idx}
          ref={(el) => (inputRefs.current[idx] = el)} // Store references to each input
          type="text"
          maxLength="1"
          className="puzzle-input"
          onChange={(e) => handleInputChange(e, idx)}
          style={{ width: '50px', height: '50px' }} // Make input boxes square
        />
      ));
    }
  };

  return (
    <div className="puzzle-container">
      <h1>Puzzle #{puzzle.number}</h1>
      <div className="input-container">{renderInputBoxes()}</div>
        <button onClick={submitClicked}>Submit</button>
      <div className="navigation">
        {puzzleNumber > 1 && (
          <Link to={`/${puzzleNumber - 1}`}>
            <button>Previous Puzzle</button>
          </Link>
        )}
        {puzzleNumber < 8 && (
          <Link to={`/${puzzleNumber + 1}`}>
            <button>Next Puzzle</button>
          </Link>
        )}
      </div>

      <div className="hint-section">
        <button onClick={() => setHintVisible(!hintVisible)}>
          {hintVisible ? 'Hide Hint' : 'Show Hint'}
        </button>
        {hintVisible && <p className="hint-text">Hint for puzzle #{puzzleNumber}</p>}
      </div>
    </div>
  );
};

export default Puzzle;
