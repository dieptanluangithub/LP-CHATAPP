import React, { useState } from 'react';
import { ReactMic } from 'react-mic';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { uploadVoice } from "configs/firebase/StorageFirebase";
import "./chatContent.css";

export default function VoiceRecorder({setLinkFileVoice}) {
  const [record, setRecord] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null)
  const [isSending, setIsSending] = useState(false);

  const onData = (recordedBlob) => {
    console.log('chunk of real-time data is: ', recordedBlob);
  };

  const onStop = async (recordedBlob) => {
    console.log('recordedBlob is: ', recordedBlob);
    setRecordedBlob(recordedBlob)
  };

  const sendMessage = async () => {
    if (!recordedBlob) {
      return;
    }

    // convert to blob object
    var blob = new Blob([recordedBlob.blob], {type: 'audio/mp3'});
    // saveBlob(blob, "voice")

    //update blob to firestore
    setIsSending(true)
    var link = await uploadVoice(blob)
    console.log('upload', link);
    setIsSending(false);
    setLinkFileVoice(link)
  }

  const saveBlob = (blob, fileName) => {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    var url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
}

  return (
    <div className='voice-container'>
      <ReactMic
        record={record}
        className="sound-wave"
        onStop={onStop}
        onData={onData}
        mimeType="audio/mp3"
        visualSetting="sinewave"
        strokeColor="#116A7B"
        backgroundColor="#ECE5C7"
      />
      <div className='voice-actions'>
        <button onClick={() => setRecord(true)} type="button" className='chatContent__buttonSend'
        variant="outline-secondary"
        name="btn_send"
        disabled={isSending}
        >
          <i class="bi bi-play-circle-fill"></i>
        </button>
        <button onClick={() => setRecord(false)} type="button" className='chatContent__buttonSend'
        variant="outline-secondary"
        name="btn_send"
        disabled={isSending}>
          <i class="bi bi-stop-circle-fill"></i>
        </button>
        <button onClick={sendMessage} type="button" className='chatContent__buttonSend'
        variant="outline-secondary"
        name="btn_send"
        hidden={!recordedBlob}
        disabled={!recordedBlob}>
          <Spinner
            as="span"
            animation="border"
            size="md"
            role="status"
            aria-hidden="true"
            hidden={!isSending}
            className='mx-2 p-1'
          />
          <i class="bi bi-send-fill"></i>
        </button>
      </div>
    </div>
  );
}
