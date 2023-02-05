import './App.css';
import data from '../assets/5000.json';
import {useEffect, useState} from "react";

const initIdx = localStorage.hasOwnProperty('currIdx')
    ? JSON.parse(localStorage.getItem('currIdx'))
    : 0;
const initIsTestMode = localStorage.hasOwnProperty('isTestMode')
    ? JSON.parse(localStorage.getItem('isTestMode'))
    : false;
function App() {

  const [currIdx, setCurrIdx] = useState(initIdx);
  const [words, setWords] = useState(data[initIdx]);
  const [showDeeperLink, setShowDeeperLink] = useState(null);
  const [isTestMode, setIsTestMode] = useState(initIsTestMode);
  const [wordInput, setWordInput] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

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

  function maskWord(word, desc) {
    return desc.replace(/\[<SPAN CLASS=tr>[^<]*<\/SPAN>]/i, "<span class=\"hidden-word\">[hidden transcription]</span>")
        .replaceAll(word, '<span class="hidden-word">{hidden word}</span>')
  }

  function validateWord(e, word) {
    e.preventDefault();
    const val = e.target.value;
    if (val.toLowerCase() === word.toLowerCase()) {
      setIsSuccess(true);
    } else {
      setWordInput(val);
    }
  }

  useEffect(() => {
    if (isSuccess) setIsSuccess(false);
    if (wordInput) setWordInput("");
    if (showDeeperLink) setShowDeeperLink(null);
    setWords(data[currIdx]);
    localStorage.setItem('currIdx', JSON.stringify(currIdx));
  }, [currIdx]);

  useEffect(() => {
    localStorage.setItem('isTestMode', JSON.stringify(isTestMode));
  }, [isTestMode]);

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
        <a href="/" onClick={e => { e.preventDefault(); setIsTestMode(!isTestMode); }}>
          {isTestMode ? "disable" : "enable"} test mode
        </a>
      </div>
      {showDeeperLink ? (
        <div className="iframe">
          <a href="/" className="close-btn" onClick={hideDeeper}>close</a>
          <iframe title={"deep learning"} src={showDeeperLink}></iframe>
        </div>
      ) : (<div>
        {Object.entries(words).map(([word, desc], i) => {
          return <div className="word" key={i}>
            {! isTestMode || isSuccess ? <p>
              <b className="title">{word}</b>
              <a href="/" onClick={(event => showDeeper(event, word))}>learn deeper >></a>
            </p> : <p>
              <br/>
              <input placeholder={"what's the word?"} value={wordInput} onChange={e => validateWord(e, word)}/>
            </p>}
            <p dangerouslySetInnerHTML={{ __html: isTestMode && !isSuccess ? maskWord(word, desc) : desc }}></p>
          </div>
        })}
      </div>)}
    </div>
  );
}

export default App;
