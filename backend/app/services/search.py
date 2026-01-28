from typing import List, Optional, Dict, Any
from app.schemas.paper import PaperResponse
from app.models.state import Document
from app.core.config import settings


class SearchService:
    """OpenSearch 검색 서비스"""

    def __init__(self):
        # TODO: OpenSearch 클라이언트 초기화
        # from opensearchpy import AsyncOpenSearch
        # self.client = AsyncOpenSearch(
        #     hosts=[{"host": settings.OPENSEARCH_HOST, "port": settings.OPENSEARCH_PORT}],
        #     http_auth=None,  # 보안 비활성화 시
        #     use_ssl=False,
        # )
        self.client = None

    async def hybrid_search(
        self,
        query: str,
        query_embedding: List[float],
        top_k: int = 20,
    ) -> List[Document]:
        """
        Hybrid Search 실행 (Dense + Sparse)

        - Dense: kNN vector search (BGE-M3 embedding)
        - Sparse: BM25 text search
        """
        # TODO: OpenSearch hybrid query 실행
        # search_body = {
        #     "query": {
        #         "hybrid": {
        #             "queries": [
        #                 {"knn": {"dense_vector": {"vector": query_embedding, "k": top_k}}},
        #                 {"multi_match": {"query": query, "fields": ["title^3", "abstract^2", "content"]}},
        #             ]
        #         }
        #     }
        # }
        # response = await self.client.search(index=settings.OPENSEARCH_INDEX, body=search_body)

        return []

    async def get_paper(self, paper_id: str) -> Optional[PaperResponse]:
        """논문 상세 조회"""
        # TODO: OpenSearch에서 논문 조회
        # response = await self.client.get(index=settings.OPENSEARCH_INDEX, id=paper_id)

        return None

    async def index_paper(self, paper: Dict[str, Any]) -> bool:
        """논문 인덱싱"""
        # TODO: OpenSearch에 논문 인덱싱
        # response = await self.client.index(
        #     index=settings.OPENSEARCH_INDEX,
        #     id=paper["id"],
        #     body=paper,
        # )

        return False
