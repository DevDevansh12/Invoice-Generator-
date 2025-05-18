import React, { useRef, useEffect, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import Button from './ui/Button';
import { RefreshCw, Save } from 'lucide-react';

interface SignaturePadProps {
  value?: string;
  onChange: (dataUrl: string) => void;
  width?: number;
  height?: number;
}

const SignaturePad: React.FC<SignaturePadProps> = ({
  value,
  onChange,
  width = 600,
  height = 200
}) => {
  const signatureRef = useRef<SignatureCanvas | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current && signatureRef.current) {
        const canvas = signatureRef.current.getCanvas();
        const container = containerRef.current;
        const ratio = Math.min(
          container.clientWidth / width,
          container.clientHeight / height
        );
        
        canvas.style.width = `${width * ratio}px`;
        canvas.style.height = `${height * ratio}px`;
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [width, height]);

  const clear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      onChange('');
      setIsDrawing(false);
    }
  };

  const save = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      const dataUrl = signatureRef.current.toDataURL('image/png');
      onChange(dataUrl);
      setIsDrawing(false);
    }
  };

  const handleBegin = () => {
    setIsDrawing(true);
  };

  return (
    <div className="space-y-4">
      <div 
        ref={containerRef}
        className="border border-gray-300 rounded-md overflow-hidden bg-white"
        style={{ minHeight: '200px' }}
      >
        {value && !isDrawing ? (
          <div className="p-4 flex justify-center items-center">
            <img
              src={value}
              alt="Signature"
              className="max-h-32"
              onClick={() => setIsDrawing(true)}
            />
          </div>
        ) : (
          <SignatureCanvas
            ref={signatureRef}
            onBegin={handleBegin}
            canvasProps={{
              className: 'signature-canvas',
              style: {
                width: '100%',
                height: '100%',
                minHeight: '200px',
                maxWidth: '100%',
                touchAction: 'none'
              }
            }}
            backgroundColor="white"
          />
        )}
      </div>
      
      <div className="flex space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={clear}
          icon={<RefreshCw size={16} />}
        >
          Clear
        </Button>
        
        <Button
          type="button"
          onClick={save}
          disabled={!isDrawing && !value}
          icon={<Save size={16} />}
        >
          Save Signature
        </Button>
      </div>
    </div>
  );
};

export default SignaturePad;