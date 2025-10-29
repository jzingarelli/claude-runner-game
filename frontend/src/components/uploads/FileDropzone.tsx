import { useState, useCallback } from 'react';

export interface FileDropzoneProps { onFiles: (files: File[]) => void }

export default function FileDropzone({ onFiles }: FileDropzoneProps) {
  const [drag, setDrag] = useState(false);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDrag(false);
    const files = Array.from(e.dataTransfer.files);
    onFiles(files);
  }, [onFiles]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
      style={{ padding: 24, border: '2px dashed #94a3b8', borderColor: drag ? '#2563eb' : '#94a3b8', textAlign: 'center' }}
    >
      Drag and drop files here
    </div>
  );
}
