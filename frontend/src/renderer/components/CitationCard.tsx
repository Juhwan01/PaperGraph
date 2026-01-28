import type { Citation } from '../stores/chatStore'

interface Props {
  citation: Citation
  index: number
}

export function CitationCard({ citation, index }: Props) {
  const handleClick = () => {
    // TODO: 논문 상세 페이지로 이동 또는 외부 링크 열기
    if (citation.url) {
      window.open(citation.url, '_blank')
    }
  }

  return (
    <div className="citation-card" onClick={handleClick}>
      <div className="citation-card__index">[{index}]</div>
      <div className="citation-card__content">
        <h4 className="citation-card__title">{citation.title}</h4>
        <p className="citation-card__authors">
          {citation.authors.join(', ')} ({citation.year})
        </p>
        <div className="citation-card__meta">
          <span className="citation-card__relevance">
            관련도: {Math.round(citation.relevance * 100)}%
          </span>
          {citation.citationsCount && (
            <span className="citation-card__citations">
              인용: {citation.citationsCount}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
