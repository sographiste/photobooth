import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import html2canvas from 'html2canvas';

function App() {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  };

  const print = async () => {
    const element = document.getElementById('capture');
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');

    const printWindow = window.open('', '_blank');
    printWindow.document.write('<img src="' + imgData + '" onload="window.print();window.close()" />');
    printWindow.document.close();
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Photobooth Mariage 📸</h1>
      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
      <br />
      <button onClick={capture}>Prendre la photo</button>
      {imgSrc && (
        <div id="capture">
          <img src={imgSrc} alt="Captured" style={{ marginTop: '20px', width: '300px' }} />
          <br />
          <button onClick={print}>Imprimer 🖨️</button>
        </div>
      )}
    </div>
  );
}

export default App;