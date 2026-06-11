import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
// import './App.css';

const puzzleData = [
  { number: 1, solutionLength: 4, type: 'text' },
  { number: 2, solutionLength: 4, type: 'text' },
  { number: 3, solutionLength: 4, type: 'text' },
  { number: 4, solutionLength: 4, type: 'text' },
  { number: 5, solutionLength: 8, type: 'text' },
  { number: 6, solutionLength: 4, type: 'text' },
  { number: 7, solutionLength: 3, type: 'text' },
  { number: 8, solutionLength: 7, type: 'text' }, // Traditional input box
];

const { hintsData } = require('./hints.js')
const { puzzleStoryContent } = require('./story.js')

const puzzleSolution = {
    1: 'SAVE' ,
    2: 'HUNT',
    3: '5729',
    4: 'GEAR',
    5: 'WBLBR247',
    6: 'HACK',
    7: '495',
    8: 'STEALTH'
};


const Puzzle = ({ puzzleNumber }) => {

    useEffect(() => {
        // Clear all input boxes when puzzleNumber changes
        inputRefs.current.forEach(input => {
            if (input) input.value = '';
        });
    }, [puzzleNumber]);

    const [popupType, setPopupType] = useState(null);
    // null | "correct" | "incorrect"

    const [currentHintIndex, setCurrentHintIndex] = useState(0);
    const [hintVisible, setHintVisible] = useState(false);
    const puzzleHints = hintsData[puzzleNumber] || [];
    const totalHints = puzzleHints.length;

    const puzzle = puzzleData[puzzleNumber - 1];
    const inputRefs = useRef([]);
    
     // Navigate to the next or previous hint
     const nextHint = () => setCurrentHintIndex(prev => Math.min(prev + 1, totalHints - 1));
     const prevHint = () => setCurrentHintIndex(prev => Math.max(prev - 1, 0));

    const handleKeyDown = (e, idx) => {
        const value = e.target.value;
        if (e.key === 'Backspace' && value === '' && idx > 0) {
            inputRefs.current[idx - 1].focus(); // Move focus to previous box
        }
    }

    const handleInputChange = (e, idx) => {
        const value = e.target.value;
        if (value.length === 1 && idx < puzzle.solutionLength - 1) {
            inputRefs.current[idx + 1].focus(); // Auto-focus next box
        }
        
    };

    const nextPrevClicked = () => {
        setCurrentHintIndex(0);
        setHintVisible(false);
    }
    
    const submitClicked = () => {
    const inputs = inputRefs.current
        .filter(input => input !== null && input !== undefined)
        .map(input => input.value)
        .join('');

    const solutionUpper = inputs.toUpperCase();

    if (solutionUpper === puzzleSolution[puzzleNumber]) {
        setPopupType("correct");
    } else {
        setPopupType("incorrect");

        // Clear inputs
        inputRefs.current.forEach(input => {
            if (input) input.value = '';
        });
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
          onKeyDown={(e) => handleKeyDown(e, idx)}
        />
      ));
    }
  };

  return (
    <div className="puzzle-container">
      <h1 className="puzzle-title">Mission Objective #{puzzle.number}</h1>
      <div className="input-container">{renderInputBoxes()}</div>
        <button onClick={submitClicked}>Submit</button>

        <hr className="line-break" style={{ width: '75%'}} />

      <div className="navigation">
        {puzzleNumber > 1 && (
          <Link to={`/${puzzleNumber - 1}`}>
            <button onClick={nextPrevClicked}>Previous Puzzle</button>
          </Link>
        )}
        {puzzleNumber < 8 && (
          <Link to={`/${puzzleNumber + 1}`}>
            <button onClick={nextPrevClicked}>Next Puzzle</button>
          </Link>
        )}
      </div>

    

      {/* Hint navigation */}
      <div className="hint-section">
                <div className="hint-nav">

                    {currentHintIndex > 0 ? (
                        <button onClick={prevHint}>
                            &larr; Previous Hint
                        </button> 
                    ) : (
                        null
                    )}
                    
                       
                    <button onClick={() => setHintVisible(!hintVisible)}>
                        {hintVisible ? (currentHintIndex === totalHints - 1 ? 'Hide Solution' : `Hide Hint #${currentHintIndex + 1}`) : (currentHintIndex === totalHints - 1 ? 'Show Solution' : `Show Hint #${currentHintIndex + 1}`)}
                    </button>

                    {/* Next hint button */}
                    {currentHintIndex < totalHints - 1 ? (
                        <button onClick={nextHint}>
                            {currentHintIndex === totalHints - 2 ? 'Next Hint (Solution)' : 'Next Hint'} &rarr;
                        </button>
                    ) : null}
                </div>

                {/* Display the current hint */}
                {hintVisible && <p className="hint-text">{puzzleHints[currentHintIndex]}</p>}
        </div>
        {/* Correct Popup */}
        {popupType === "correct" && (
            <div className="popup-container">
                <p className="popup-story">
                    {puzzleStoryContent[puzzleNumber]}
                </p>

                <button
                    onClick={() => {
                        setPopupType(null);
                        if (puzzleNumber < 8) {
                            window.location.href = `/${puzzleNumber + 1}`;
                        }
                    }}
                >
                    Ok
                </button>
            </div>
        )}

        {/* Incorrect Popup */}
        {popupType === "incorrect" && (
            <div className="incorrect-popup-container">
                <p>Incorrect, try again.</p>
                <button
                    onClick={() => setPopupType(null)}
                    style={{ display: "block", margin: "0 auto", color: "red", borderColor: "red" }}
                >
                    Ok
                </button>
            </div>
        )}
    </div>
  );
};

export default Puzzle;
