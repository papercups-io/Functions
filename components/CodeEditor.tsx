import React from 'react';
import AceEditor, {IAceEditorProps} from 'react-ace';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import 'ace-builds/src-noconflict/theme-monokai';

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
      readOnly
      wrapEnabled
      {...props}
    />
  );
};

export default CodeEditor;
