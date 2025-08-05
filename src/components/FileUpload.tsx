import React, { useCallback, useState } from 'react';
import { Upload, X, FileText, Image, File } from 'lucide-react';
import { UploadedFile } from '../types';

interface FileUploadProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ files, onFilesChange, disabled }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileRead = useCallback((file: File): Promise<UploadedFile> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve({
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
          data: result,
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const handleFiles = useCallback(async (fileList: FileList) => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp'
    ];

    const validFiles = Array.from(fileList).filter(file => 
      validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024 // 10MB limit
    );

    try {
      const uploadedFiles = await Promise.all(validFiles.map(handleFileRead));
      onFilesChange([...files, ...uploadedFiles]);
    } catch (error) {
      console.error('Error reading files:', error);
    }
  }, [files, onFilesChange, handleFileRead]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!disabled && e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles, disabled]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const removeFile = useCallback((fileId: string) => {
    onFilesChange(files.filter(f => f.id !== fileId));
  }, [files, onFilesChange]);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (type === 'application/pdf') return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      <label
        className={`block border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${
          isDragOver
            ? 'border-purple-500 bg-purple-50'
            : disabled
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className={`w-8 h-8 mx-auto mb-3 ${disabled ? 'text-gray-400' : 'text-gray-500'}`} />
        <p className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>
          Drag and drop files here, or click anywhere to browse
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Supports PDF, DOCX, and image files (max 10MB each)
        </p>
        <input
          type="file"
          multiple
          accept=".pdf,.docx,.jpg,.jpeg,.png,.gif,.webp"
          onChange={handleFileInput}
          disabled={disabled}
          className="hidden"
        />
      </label>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="flex items-center space-x-3">
                {getFileIcon(file.type)}
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFile(file.id)}
                disabled={disabled}
                className={`p-1 rounded-full transition-colors duration-150 ${
                  disabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};