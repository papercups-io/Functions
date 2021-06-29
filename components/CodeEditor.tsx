import React from 'react';
import AceEditor, {IAceEditorProps} from 'react-ace';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import 'ace-builds/src-noconflict/theme-monokai';

export const DEMO_SOURCE = `
// See https://github.com/papercups-io/papercups-node#usage
const papercups = require('@papercups-io/papercups')(
  process.env.PAPERCUPS_API_KEY
);

// This function will be exported to handle incoming webhook events!
export async function handler({event, payload}) {
  switch (event) {
    // See https://docs.papercups.io/webhook-events#messagecreated
    case 'message:created':
      const {body, conversation_id} = payload;

      // Sends an auto-response to incoming messages
      // See https://docs.papercups.io/api-endpoints#messages
      return papercups.messages.create({
        body: getResponseMessage(body),
        type: 'bot',
        conversation_id,
      });
    default:
      return {event, payload};
  }
}

function getResponseMessage(text) {
  const formatted = text.toLowerCase();

  if (formatted.includes('test')) {
    return 'Test successful!';
  } else if (formatted.includes('pricing')) {
    return 'Check out our pricing at https://papercups.io/pricing';
  } else {
    return \`This is the default message. Received: "\${text}"\`;
  }
}
`.trim();

export const CodeEditor = (props: IAceEditorProps) => {
  const {height = '100%', width = '100%'} = props;

  return (
    <AceEditor
      mode="javascript"
      theme="tomorrow_night"
      name="CodeEditor-AceEditor"
      height={height}
      width={width}
      tabSize={2}
      value={DEMO_SOURCE}
      readOnly
      wrapEnabled
    />
  );
};

export default CodeEditor;
