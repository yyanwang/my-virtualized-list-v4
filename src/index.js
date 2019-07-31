import React from "react";
import ReactDOM from "react-dom";
import List from "./List";

import "./styles.css";

function App() {
  return (
    <div className="App">
      <List
        height={300}
        rowHeight={i => (i % 2 === 0 ? 30 : 40)}
        items={[...Array(10000).keys()]}
      >
        {({ item, style, index }) => (
          <div
            key={index}
            className={item % 2 === 0 ? "list-item-even" : "list-item-odd"}
            style={style}
          >
            Row {item}
          </div>
        )}
      </List>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
