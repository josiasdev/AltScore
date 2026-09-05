from app.routes.auth import router as auth_router
from app.routes.score import router as score_router
from app.routes.properties import router as properties_router
from app.routes.contracts import router as contracts_router

__all__ = ["auth_router", "score_router", "properties_router", "contracts_router"]
