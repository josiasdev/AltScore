from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import Property
from app.schemas.property import PropertyResponse

router = APIRouter(prefix="/api/properties", tags=["properties"])


@router.get("", response_model=list[PropertyResponse])
def list_properties(db: Session = Depends(get_db)):
    properties = db.query(Property).all()
    return [PropertyResponse.model_validate(p) for p in properties]


@router.get("/{property_id}", response_model=PropertyResponse)
def get_property(property_id: int, db: Session = Depends(get_db)):
    property = db.query(Property).filter(Property.id == property_id).first()
    if not property:
        raise HTTPException(status_code=404, detail="Imóvel não encontrado")
    return PropertyResponse.model_validate(property)
