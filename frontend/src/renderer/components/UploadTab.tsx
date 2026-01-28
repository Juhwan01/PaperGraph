import { useState, useCallback } from 'react'

interface UploadedFile {
  id: string
  name: string
  size: number
  status: 'pending' | 'uploading' | 'done' | 'error'
  progress: number
}

export function UploadTab() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.type === 'application/pdf'
    )
    addFiles(droppedFiles)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      addFiles(selectedFiles)
    }
  }

  const addFiles = (newFiles: File[]) => {
    const uploadFiles: UploadedFile[] = newFiles.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      status: 'pending',
      progress: 0,
    }))
    setFiles((prev) => [...prev, ...uploadFiles])
  }

  const handleUpload = async () => {
    // TODO: 실제 업로드 로직 (백엔드 연동)
    for (const file of files) {
      if (file.status !== 'pending') continue

      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id ? { ...f, status: 'uploading', progress: 0 } : f
        )
      )

      // 시뮬레이션 (실제로는 fetch로 백엔드에 전송)
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((r) => setTimeout(r, 100))
        setFiles((prev) =>
          prev.map((f) => (f.id === file.id ? { ...f, progress: i } : f))
        )
      }

      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id ? { ...f, status: 'done', progress: 100 } : f
        )
      )
    }
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const pendingCount = files.filter((f) => f.status === 'pending').length

  return (
    <div className="upload-tab">
      {/* 드래그 앤 드롭 영역 */}
      <div
        className={`upload-zone ${isDragging ? 'upload-zone--active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="upload-zone__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M7 18a4.6 4.4 0 01-.1-8.8 7 7 0 0113.8 1.8 4 4 0 01-.6 7.8H7z" />
            <polyline points="16 13 12 9 8 13" />
            <line x1="12" y1="9" x2="12" y2="17" />
          </svg>
        </div>
        <p className="upload-zone__text">
          PDF 파일을 드래그하거나
          <label className="upload-zone__label">
            <input
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileSelect}
              hidden
            />
            <span>파일 선택</span>
          </label>
        </p>
        <p className="upload-zone__hint">논문 PDF를 업로드하면 AI가 학습합니다</p>
      </div>

      {/* 파일 목록 */}
      {files.length > 0 && (
        <div className="upload-files">
          <div className="upload-files__header">
            <span>{files.length}개 파일</span>
            {pendingCount > 0 && (
              <button className="upload-files__btn" onClick={handleUpload}>
                업로드 시작
              </button>
            )}
          </div>

          <ul className="upload-files__list">
            {files.map((file) => (
              <li key={file.id} className="upload-file">
                <div className="upload-file__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>

                <div className="upload-file__info">
                  <span className="upload-file__name">{file.name}</span>
                  <span className="upload-file__size">{formatSize(file.size)}</span>
                </div>

                <div className="upload-file__status">
                  {file.status === 'pending' && (
                    <button
                      className="upload-file__remove"
                      onClick={() => removeFile(file.id)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  {file.status === 'uploading' && (
                    <div className="upload-file__progress">
                      <div
                        className="upload-file__progress-bar"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                  {file.status === 'done' && (
                    <svg
                      className="upload-file__check"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
