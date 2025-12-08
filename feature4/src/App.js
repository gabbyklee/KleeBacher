import React from "react";
import Parse from "parse";
import Components from "./Components/Components";
import * as Env from "./environments";

// Initialize Parse
Parse.initialize(Env.APPLICATION_ID, Env.JAVASCRIPT_KEY);
Parse.serverURL = Env.SERVER_URL;

Parse.liveQueryServerURL = Env.LIVE_QUERY_SERVER_URL;

function App() {
  return <Components />;
}

export default App;

