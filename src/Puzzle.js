import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const puzzleData = [
  { number: 1, solutionLength: 4, type: 'text' },
  { number: 2, solutionLength: 10, type: 'text' },
  { number: 3, solutionLength: 4, type: 'text' },
  { number: 4, solutionLength: 8, type: 'text' },
  { number: 5, solutionLength: 4, type: 'text' },
  { number: 6, solutionLength: 7, type: 'text' },
  { number: 7, solutionLength: 3, type: 'text' },
  { number: 8, solutionLength: 7, type: 'text' }, // Traditional input box
];

// Example hint data with solution
const hintsData = {
    1: ['Hint 1 for puzzle 1', 'Hint 2 for puzzle 1', 'Hint 3 for puzzle 1', 'Solution for puzzle 1'],
    2: ['Hint 1 for puzzle 2', 'Hint 2 for puzzle 2', 'Hint 3 for puzzle 2', 'Solution for puzzle 2'],
    3: ['Hint 1 for puzzle 3', 'Hint 2 for puzzle 3', 'Hint 3 for puzzle 3', 'Solution for puzzle 3'],
    4: ['Hint 1 for puzzle 4', 'Hint 2 for puzzle 4', 'Hint 3 for puzzle 4', 'Solution for puzzle 4'],
    5: ['Hint 1 for puzzle 5', 'Hint 2 for puzzle 5', 'Hint 3 for puzzle 5', 'Solution for puzzle 5'],
    6: ['Hint 1 for puzzle 6', 'Hint 2 for puzzle 6', 'Hint 3 for puzzle 6', 'Solution for puzzle 6'],
    7: ['Hint 1 for puzzle 7', 'Hint 2 for puzzle 7', 'Hint 3 for puzzle 7', 'Solution for puzzle 7'],
    8: ['Hint 1 for puzzle 8', 'Hint 2 for puzzle 8', 'Hint 3 for puzzle 8', 'Solution for puzzle 8'],
    // Add similar entries for other puzzles
};

const puzzleSolution = {
    1: 'SAVE' ,
    2: 'NIGHTSHADE',
    3: '1111' ,
    4: 'SECURITY' ,
    5: '2579' ,
    6: 'STEALTH' ,
    7: '495' ,
    8: 'SBB6825' 
};


const Puzzle = ({ puzzleNumber }) => {

    
    
    useEffect(() => {
        // Clear all input boxes when puzzleNumber changes
        inputRefs.current.forEach(input => {
            if (input) input.value = '';
        });
    }, [puzzleNumber]);
    
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
        if (e.key === 'Backspace' && e.target.value === '' && idx > 0) {
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
        // Get the input from the separate input boxes
        const inputs = inputRefs.current
            .filter(input => input !== null && input !== undefined)
            .map(input => input.value)
            .join('');
        var solutionLower = inputs.toUpperCase();
        if (solutionLower === puzzleSolution[puzzleNumber]) {
            if (puzzleNumber < 8) {
                // Create a popup element
                const popup = document.createElement('div');
                popup.style.position = 'fixed';
                popup.style.top = '50%';
                popup.style.left = '50%';
                popup.style.transform = 'translate(-50%, -50%)';
                popup.style.padding = '20px';
                popup.style.backgroundColor = 'white';
                popup.style.border = '2px solid green';
                popup.style.zIndex = '1000';
                popup.innerHTML = `
                    <p>Correct! You can now access the contents of the next puzzle.</p>
                    <button id="popup-ok-button" style="display: block; margin: 0 auto;">Ok</button>
                `;

                // Append the popup to the body
                document.body.appendChild(popup);

                // Add event listener to the button to remove the popup and navigate to the next puzzle
                document.getElementById('popup-ok-button').addEventListener('click', () => {
                    document.body.removeChild(popup);
                    window.location.href = `/${puzzleNumber + 1}`;
                });

            } else {
                alert('Congratulations! You have completed all puzzles.');
            }
        } else {
            // Create a popup element
            const popup = document.createElement('div');
            popup.style.color = 'red';
            
            popup.style.position = 'fixed';
            popup.style.top = '50%';
            popup.style.left = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
            popup.style.padding = '20px';
            popup.style.backgroundColor = 'white';
            popup.style.border = '2px solid red';
            popup.style.zIndex = '1000';
            popup.innerHTML = `
                <p>Incorrect, try again.</p>
                <button id="popup-try-again-button" style="display: block; margin: 0 auto; color: red; border-color: red;">Ok</button>
            `;

            // Append the popup to the body
            document.body.appendChild(popup);

            // Add event listener to the button to remove the popup
            document.getElementById('popup-try-again-button').addEventListener('click', () => {
                document.body.removeChild(popup);
            });


            inputRefs.current.forEach(input => {
                if (input) input.value = '';
            });

        }
    }

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
      <h1>Puzzle #{puzzle.number}</h1>
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
    </div>
  );
};

export default Puzzle;
