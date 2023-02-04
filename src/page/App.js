import './App.css';
import data from '../assets/5000.json';
import {useEffect, useState} from "react";

const initIdx = localStorage.hasOwnProperty('currIdx')
    ? JSON.parse(localStorage.getItem('currIdx'))
    : 0;
function App() {

  const [currIdx, setCurrIdx] = useState(initIdx);
  const [words, setWords] = useState(data[initIdx]);

  useEffect(() => {
    setWords(data[currIdx]);
    localStorage.setItem('currIdx', JSON.stringify(currIdx));
  }, [currIdx]);

  function prev(e) {
    e.preventDefault();
    if (currIdx > 0) setCurrIdx(currIdx - 1);
    return null;
  }
  function next(e) {
    e.preventDefault();
    if (currIdx < data.length) setCurrIdx(currIdx + 1);
    return null;
  }

  window.addEventListener('keyup', (e) => {
    switch (e.key) {
      case "ArrowRight": return next(e);
      case "ArrowLeft": return prev(e);
    }
  });

  return (
    <div className="container">
      <div className="stat">
        <a href="#" onClick={prev}>prev</a>
        [ {currIdx + 1} / {data.length} ]
        <a href="#" onClick={next}>next</a>
      </div>
      {Object.entries(words).map(([word, desc], i) => {
        return <div className="word" key={i}>
          <p>
            <b className="title">{word}</b>
            <a
                href={"https://www.merriam-webster.com/dictionary/" + word}
                target="_blank"
                rel="noopener noreferrer"
            >
              learn deeper >>
            </a>
          </p>
          <p dangerouslySetInnerHTML={{ __html: desc }}></p>
        </div>
      })}
    </div>
  );
}

export default App;
