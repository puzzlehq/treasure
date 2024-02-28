import { Html5Qrcode } from "html5-qrcode";
import { useRef, useState } from "react";
import qrScannerImg from '@assets/qrScanner.svg';

interface PasteyQRProps {
  setOpponent: (address: string) => void;
  opponent: string;
}

export const PasteyQR = ( {setOpponent, opponent}: PasteyQRProps ) => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const startScanner = async () => {
      setIsScanning(true);

      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode('qr-code-scanner');
      }

      const cameraFacingMode = isMobile ? 'environment' : 'user';

      try {
        await scannerRef.current.start(
          { facingMode: cameraFacingMode },
          { fps: 10, qrbox: 250 },
          handleScanSuccess,
          handleScanError
        );
      } catch (err) {
        console.error("Unable to start scanning", err);
      }
  };

  const handleScanSuccess = (decodedText: string) => {
      setIsScanning(false);
      setOpponent(decodedText);
      console.log(opponent);
      if (scannerRef.current) {
          scannerRef.current.stop().catch(err => console.error("Failed to stop the scanner", err));
      }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleScanError = (error: any) => {
      console.info(`QR Code scan error: ${error}`);
  };

  const handlePasteFromClipboard = async () => {
      const clipboardData = await navigator.clipboard.readText();
      setOpponent(clipboardData);
      console.log(opponent);
  };
  return (
    <div className="flex w-full flex-col items-center">
      <input
        type='text'
        className='mt-5 w-full rounded-lg border-[3px] border-solid border-bg2 bg-transparent p-4 text-sm font-semibold leading-4 max-md:mr-px focus:outline-none focus:border-primary'
        placeholder="Enter Opponent's Address"
        id='opponent'
        value={opponent ?? ''}
        onChange={(e) => {
          setOpponent(e.target.value);
        }}
      />
      <div className="flex items-center">  {/* Use flex container here */}
        <button
          onClick={handlePasteFromClipboard}
          className="text-black text-center text-xs font-extrabold bg-zinc-500 self-center w-[197px] max-w-full mt-3 px-5 py-3 rounded-[200px]"
        >
          PASTE FROM CLIPBOARD
        </button>
        <button
          onClick={startScanner}
        >
          <img src={qrScannerImg} alt="QR Scanner" className="ml-5 mt-3 h-full"/>
        </button>
      </div>
      <div id="qr-code-scanner" className="w-full mb-2 relative" style={{ height: '240px' }}>
        {isScanning && (
          <style>
            {`
              #qr-code-scanner::before {
                  content: "";
                  position: absolute;
                  top: 12.5%;
                  left: 12.5%;
                  width: 75%;
                  height: 75%;
                  border: 3px solid lightgreen;
                  background-color: rgba(255, 255, 255, 0.3); /* semi-transparent fill */
                  box-sizing: border-box;
              }
            `}
          </style>
          )}
      </div>
    </div>
  );
}