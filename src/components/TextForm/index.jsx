import React, { useState, useEffect } from "react";
import { Editor, EditorState, Modifier, CompositeDecorator } from "draft-js";
import * as draftOperations from "../helper";
import "./Editor.css";
import "../../../node_modules/draft-js/dist/Draft.css";
import { MDBBtn } from "mdb-react-ui-kit";
import "./mdb.scss";
import TextStats from "./TextStats";

export default function TextForm(props) {
  const [textbox, setTextbox] = useState(EditorState.createEmpty());
  const [operativeText, setOperativeText] = useState("");
  const [selectionState, setSelectionState] = useState(null);

  useEffect(() => {
    const ContentState = textbox.getCurrentContent();
    let selectionState = textbox.getSelection();
    let selectedText = draftOperations.getTextSelection(
      ContentState,
      selectionState
    );
    if (!selectedText) {
      selectionState = draftOperations.selectAll(textbox, ContentState);
      selectedText = ContentState.getPlainText();
    }

    setSelectionState(selectionState);
    setOperativeText(selectedText);
  }, [textbox]);

  useEffect(() => {
    if (window.speechSynthesis.speaking) {
      // If speaking, stop the speech
      window.speechSynthesis.cancel();
    }
  }, [operativeText])


  function highlightKeyWord(keyword) {
    setTextbox(
      EditorState.set(textbox, { decorator: generateDecorator(keyword) })
    );
  }

  const generateDecorator = (highlightTerm) => {
    const regex = new RegExp(highlightTerm, "gi");
    return new CompositeDecorator([
      {
        strategy: (contentBlock, callback) => {
          if (highlightTerm !== "") {
            findWithRegex(regex, contentBlock, callback);
          }
        },
        component: SearchHighlight,
      },
    ]);
  };

  const onEditorChange = (newState) => {
    setTextbox(
      EditorState.set(newState, { decorator: generateDecorator(null) })
    );
  };

  const findWithRegex = (regex, contentBlock, callback) => {
    const text = contentBlock.getText();
    let matchArr, start, end;
    while ((matchArr = regex.exec(text)) !== null) {
      start = matchArr.index;
      end = start + matchArr[0].length;
      callback(start, end);
    }
  };

  const SearchHighlight = (props) => (
    <span className="highlight">{props.children}</span>
  );

  function handleUpClick(e) {
    let uppercaseText;
    uppercaseText = operativeText.toUpperCase();
    draftOperations.updateEditorContent(
      textbox,
      selectionState,
      uppercaseText,
      setTextbox,
      Modifier,
      EditorState
    );
  }

  function handleLowClick(e) {
    let lowercaseText;
    lowercaseText = operativeText.toLowerCase();
    draftOperations.updateEditorContent(
      textbox,
      selectionState,
      lowercaseText,
      setTextbox,
      Modifier,
      EditorState
    );
  }

  function handleAlternateClick(e) {
    let alternateText;
    alternateText = operativeText.toLowerCase().split("");
    for (let i = 0; i < alternateText.length; i += 2) {
      alternateText[i] = alternateText[i].toUpperCase();
    }
    draftOperations.updateEditorContent(
      textbox,
      selectionState,
      alternateText.join(""),
      setTextbox,
      Modifier,
      EditorState
    );
  }

  function handleTitleClick() {
    let regex = /[^\s().]+/g;
    let modifiedText = operativeText
      .toLowerCase()
      .replace(regex, function (match) {
        return match.charAt(0).toUpperCase() + match.slice(1);
      });
    draftOperations.updateEditorContent(
      textbox,
      selectionState,
      modifiedText,
      setTextbox,
      Modifier,
      EditorState
    );
  }

  function handleSentenceClick() {
    let regex = /(^|\.\s+|\n+)([a-z])/gim;
    let modifiedText = operativeText
      .toLowerCase()
      .replace(regex, function (match) {
        return match.toUpperCase();
      });
    draftOperations.updateEditorContent(
      textbox,
      selectionState,
      modifiedText,
      setTextbox,
      Modifier,
      EditorState
    );
  }

  function handleInverseClick() {
    let chars = operativeText.split("");
    let modifiedText = chars
      .map((ch) => {
        if (ch === ch.toUpperCase()) {
          return ch.toLowerCase();
        } else {
          return ch.toUpperCase();
        }
      })
      .join("");
    draftOperations.updateEditorContent(
      textbox,
      selectionState,
      modifiedText,
      setTextbox,
      Modifier,
      EditorState
    );
  }

  function handleClearClick(e) {
    setTextbox(EditorState.createEmpty());
  }

  function handleReadClick(e) {

    // If not speaking, proceed to read the text
    if (operativeText.length) {
      let speech = new SpeechSynthesisUtterance();
      speech.text = operativeText;
      window.speechSynthesis.speak(speech);
    } else {
      // Show an alert if there is nothing to read
      props.showAlert("Nothing to read", "warning");
    }

  }


  const wordCount = (operativeText.match(/[^\s]+/g) || []).length;

  return (
    <div className="container d-flex gap-5 align-items-stretch flex-wrap">
      <main style={{ flex: "11 0 0" }} className="material-element">
        <h1 className="my-3 fs-4">{props.heading}</h1>
        <div className="my-2">
          <p style={{ marginBottom: 0 }}>
            {wordCount} Words, {operativeText ? operativeText.length : 0} Characters
          </p>
          <p style={{ marginBottom: 0 }}>
            {Math.floor((operativeText ? operativeText.split(" ").length : 0) * 0.008)} Minutes
          </p>
        </div>
        <div className="mb-3 position-relative">
          <Editor editorState={textbox} onChange={onEditorChange} id="myBox" />
        </div>

        <div className="text-controls d-flex flex-wrap gap-2">
          <MDBBtn
            size="sm"
            onClick={handleUpClick}
            disabled={operativeText.length === 0}
            outline
            rounded
          >
            Uppercase
          </MDBBtn>
          <MDBBtn
            size="sm"
            onClick={handleLowClick}
            disabled={operativeText.length === 0}
            outline
            rounded
            color="secondary"
          >
            Lowercase
          </MDBBtn>
          <MDBBtn
            size="sm"
            onClick={handleAlternateClick}
            disabled={operativeText.length === 0}
            outline
            rounded
            color="success"
          >
            Alternate Case
          </MDBBtn>
          <MDBBtn
            size="sm"
            onClick={handleTitleClick}
            disabled={operativeText.length === 0}
            outline
            rounded
            color="danger"
          >
            Title Case
          </MDBBtn>
          <MDBBtn
            size="sm"
            onClick={handleSentenceClick}
            disabled={operativeText.length === 0}
            outline
            rounded
            color="warning"
          >
            Sentence Case
          </MDBBtn>
          <MDBBtn
            size="sm"
            onClick={handleInverseClick}
            disabled={operativeText.length === 0}
            outline
            rounded
            color="info"
          >
            Inverse Case
          </MDBBtn>
          <MDBBtn
            size="sm"
            onClick={handleClearClick}
            disabled={operativeText.length === 0}
            outline
            rounded
            color={props.revMode}
          >
            Clear
          </MDBBtn>
          <MDBBtn
            size="sm"
            onClick={handleReadClick}
            disabled={operativeText.length === 0}
            outline
            rounded
          >
            <i className="fa-solid fa-bullhorn"></i> Speak
          </MDBBtn>
        </div>
      </main>
      <TextStats operativeText={operativeText} highlightKeyWord={highlightKeyWord} />
    </div>
  );
}
