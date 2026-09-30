/**
 * Utility to extract clean text from uploaded files (TXT, PDF preview, or plain text)
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'txt' || extension === 'md') {
    return await file.text();
  }

  // For PDF or DOCX, read text or extract readable strings
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const buffer = reader.result as ArrayBuffer;
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const rawText = decoder.decode(buffer);

      // Extract alphanumeric chunks and clean lines from binary/pdf streams
      const cleanChunks = rawText
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 2 && /[a-zA-Z0-9]/.test(line));

      if (cleanChunks.length > 10) {
        resolve(cleanChunks.slice(0, 150).join('\n'));
      } else {
        // Fallback: provide a clean notification and suggest pasting
        resolve(
          `Extracted text from ${file.name}:\n(If formatting appears truncated, you can also directly paste your resume text in the editor below for maximum parsing precision).\n\n` +
          cleanChunks.join('\n')
        );
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file. Please paste your resume text directly.'));
    };

    reader.readAsArrayBuffer(file);
  });
}
