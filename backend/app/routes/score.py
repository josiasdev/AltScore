from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User, Score
from app.schemas.score import ScoreResponse, ScoreBreakdown, ScoreSimulate
from app.services.score_engine import score_engine
from app.services.solana import register_score_on_chain
from app.utils.crypto import get_current_user

router = APIRouter(prefix="/api/score", tags=["score"])


@router.get("", response_model=ScoreResponse | None)
def get_score(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    score = db.query(Score).filter(Score.user_id == current_user.id).first()
    if not score:
        return None

    return ScoreResponse(
        total=score.total,
        breakdown=ScoreBreakdown(
            payment=score.payment_score,
            income=score.income_score,
            finance=score.finance_score,
            social=score.social_score,
        ),
        level=score.level,
        connected_sources=score.connected_sources.split(",") if score.connected_sources else [],
    )


@router.post("/calculate", response_model=ScoreResponse)
def calculate_score(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    sources = ["pix", "subscriptions", "open_finance"]
    result = score_engine.calculate(current_user.id, sources)

    existing = db.query(Score).filter(Score.user_id == current_user.id).first()
    if existing:
        existing.total = result["total"]
        existing.payment_score = result["breakdown"]["payment"]
        existing.income_score = result["breakdown"]["income"]
        existing.finance_score = result["breakdown"]["finance"]
        existing.social_score = result["breakdown"]["social"]
        existing.level = result["level"]
        existing.connected_sources = ",".join(result["connected_sources"])
    else:
        score = Score(
            user_id=current_user.id,
            total=result["total"],
            payment_score=result["breakdown"]["payment"],
            income_score=result["breakdown"]["income"],
            finance_score=result["breakdown"]["finance"],
            social_score=result["breakdown"]["social"],
            level=result["level"],
            connected_sources=",".join(result["connected_sources"]),
        )
        db.add(score)

    db.commit()

    solana_result = None
    try:
        solana_result = register_score_on_chain(result["total"], result["level"])
    except Exception as e:
        print(f"[Solana] Score registration failed: {e}")

    return ScoreResponse(
        total=result["total"],
        breakdown=ScoreBreakdown(**result["breakdown"]),
        level=result["level"],
        connected_sources=result["connected_sources"],
        solana_tx=solana_result,
    )


@router.post("/simulate", response_model=ScoreResponse)
def simulate_score(
    data: ScoreSimulate,
    current_user: User = Depends(get_current_user),
):
    result = score_engine.calculate(current_user.id, data.sources)

    return ScoreResponse(
        total=result["total"],
        breakdown=ScoreBreakdown(**result["breakdown"]),
        level=result["level"],
        connected_sources=result["connected_sources"],
    )
