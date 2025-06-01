import React from 'react'
import Keywords from '../Keywords/Keywords'

const TextStats = ({ operativeText, highlightKeyWord }) => {

    const wordCount = (operativeText.match(/[^\s]+/g) || []).length;

    return (
        <aside
            style={{ flex: "1 2 300px", "--bs-bg-opacity": "0.4" }}
            className="bg-light p-3 rounded-4"
        >
            <ul
                className="nav nav-pills mb-3 nav-justified"
                id="pills-tab"
                role="tablist"

            >
                <li className="nav-item" role="presentation">
                    <button
                        className="nav-link active"
                        id="pills-home-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-home"
                        type="button"
                        role="tab"
                        aria-controls="pills-home"
                        aria-selected="true"
                    >
                        Summary
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className="nav-link"
                        id="pills-profile-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-profile"
                        type="button"
                        role="tab"
                        aria-controls="pills-profile"
                        aria-selected="false"
                    >
                        Keyword Density
                    </button>
                </li>
            </ul>
            <div className="tab-content" id="pills-tabContent">
                <div
                    className="tab-pane fade show active"
                    id="pills-home"
                    role="tabpanel"
                    aria-labelledby="pills-home-tab"
                    tabIndex="0"
                >
                    <li
                        style={{ listStyleType: "none", cursor: "pointer" }}
                        className="border-bottom border-1 py-1"
                    >
                        <span
                            className="badge bg-secondary px-2 py-1 rounded-pill float-end"
                            style={{ marginTop: "2px" }}
                        >
                            {wordCount}
                        </span>
                        Words
                    </li>
                    <li
                        style={{ listStyleType: "none", cursor: "pointer" }}
                        className="border-bottom border-1 py-1"
                    >
                        <span
                            className="badge bg-secondary px-2 py-1 rounded-pill float-end"
                            style={{ marginTop: "2px" }}
                        >
                            {operativeText ? operativeText.length : 0}
                        </span>
                        Characters
                    </li>
                    <li
                        style={{ listStyleType: "none", cursor: "pointer" }}
                        className="border-bottom border-1 py-1"
                    >
                        <span
                            className="badge bg-secondary px-2 py-1 rounded-pill float-end"
                            style={{ marginTop: "2px" }}
                        >
                            {operativeText
                                ? operativeText
                                    .split(".")
                                    .filter((sentence) => sentence.trim().length).length
                                : 0}
                        </span>
                        Sentences
                    </li>
                    <li
                        style={{ listStyleType: "none", cursor: "pointer" }}
                        className="border-bottom border-1 py-1"
                    >
                        <span
                            className="badge bg-secondary px-2 py-1 rounded-pill float-end"
                            style={{ marginTop: "2px" }}
                        >
                            {operativeText
                                ? operativeText
                                    .split("\n\n")
                                    .filter((sentence) => sentence.trim().length).length
                                : 0}
                        </span>
                        Paragraphs
                    </li>
                    <li
                        style={{ listStyleType: "none", cursor: "pointer" }}
                        className="border-bottom border-1 py-1"
                    >
                        <span
                            className="badge bg-secondary px-2 py-1 rounded-pill float-end"
                            style={{ marginTop: "2px" }}
                        >
                            {Math.floor(
                                (operativeText ? operativeText.split(" ").length : 0) * 0.25
                            )}{" "}
                            sec
                        </span>
                        Reading Time
                    </li>
                </div>
                <div
                    className="tab-pane fade"
                    id="pills-profile"
                    role="tabpanel"
                    aria-labelledby="pills-profile-tab"
                    tabIndex="0"
                >
                    {wordCount !== 0 && (
                        <Keywords
                            inputText={operativeText}
                            highlightKeyWord={highlightKeyWord}
                        />
                    )}
                </div>
            </div>
        </aside>
    )
}

export default TextStats