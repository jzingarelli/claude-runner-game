import { useState } from 'react';
import FileDropzone from '@/components/uploads/FileDropzone';
import { api } from '@/services/api';

export default function FilesPage() {
  const [status, setStatus] = useState<string>('');
  return (
    <div>
      <h2>Files</h2>
      <FileDropzone onFiles={async (files) => {
        const f = files[0];
        const { data } = await api.post('/files/presign', { contentType: f.type, extension: f.name.split('.').pop() });
        await fetch(data.url, { method: 'PUT', headers: { 'Content-Type': f.type }, body: f });
        setStatus(`Uploaded to ${data.key}`);
      }} />
      <p>{status}</p>
    </div>
  );
}
