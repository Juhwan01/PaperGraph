from fastapi import APIRouter, HTTPException
from app.schemas.paper import PaperResponse
from app.services.search import SearchService

router = APIRouter()


@router.get("/{paper_id}", response_model=PaperResponse)
async def get_paper(paper_id: str):
    """논문 상세 조회"""
    search_service = SearchService()
    paper = await search_service.get_paper(paper_id)

    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")

    return paper
