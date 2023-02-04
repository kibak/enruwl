import './App.css';
import data from '../assets/5000.json';
import {useEffect, useState} from "react";

const initIdx = localStorage.hasOwnProperty('currIdx')
    ? JSON.parse(localStorage.getItem('currIdx'))
    : 0;
function App() {

  const [currIdx, setCurrIdx] = useState(initIdx);
  const [words, setWords] = useState(data[initIdx]);
  const [showDeeperLink, setShowDeeperLink] = useState(null);

  function prev(e) {
    e.preventDefault();
    if (showDeeperLink) setShowDeeperLink(null);
    if (currIdx > 0) setCurrIdx(currIdx - 1);
    return null;
  }

  function next(e) {
    e.preventDefault();
    if (showDeeperLink) setShowDeeperLink(null);
    if (currIdx < data.length) setCurrIdx(currIdx + 1);
    return null;
  }

  function showDeeper(e, word) {
    e.preventDefault();
    if (! showDeeperLink)
      setShowDeeperLink("https://www.merriam-webster.com/dictionary/" + word);
    return null;
  }

  function hideDeeper(e) {
    e.preventDefault();
    if (showDeeperLink) setShowDeeperLink(null);
    return null;
  }

  function handleKeyPress(e) {
    switch (e.key) {
      case "ArrowRight": return next(e);
      case "ArrowLeft": return prev(e);
      default: return null;
    }
  }

  useEffect(() => {
    setWords(data[currIdx]);
    localStorage.setItem('currIdx', JSON.stringify(currIdx));
  }, [currIdx]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  });

  return (
    <div className="container">
      <div className="stat">
        <a href="/" onClick={prev}>prev</a>
        [ {currIdx + 1} / {data.length} ]
        <a href="/" onClick={next}>next</a>
      </div>
      {showDeeperLink ? (
        <div className="iframe">
          <a href="/" className="close-btn" onClick={hideDeeper}>close</a>
          <iframe title={"deep learning"} src={showDeeperLink}></iframe>
        </div>
      ) : (<div>
        {Object.entries(words).map(([word, desc], i) => {
          return <div className="word" key={i}>
            <p>
              <b className="title">{word}</b>
              <a href="/" onClick={(event => showDeeper(event, word))}>learn deeper >></a>
            </p>
            <p dangerouslySetInnerHTML={{ __html: desc }}></p>
          </div>
        })}
      </div>)}
    </div>
  );
}

export default App;
