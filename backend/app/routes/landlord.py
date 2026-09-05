from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User, Property, Contract
from app.schemas.contract import ContractResponse
from app.utils.crypto import get_current_user

router = APIRouter(prefix="/api/landlord", tags=["landlord"])


@router.get("/properties", response_model=list[dict])
def list_landlord_properties(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    properties = db.query(Property).filter(
        Property.landlord_name == current_user.full_name
    ).all()

    result = []
    for p in properties:
        contracts_count = db.query(Contract).filter(
            Contract.property_id == p.id
        ).count()
        result.append({
            "id": p.id,
            "title": p.title,
            "address": p.address,
            "rent_value": p.rent_value,
            "accepts_altscore": p.accepts_altscore,
            "contracts_count": contracts_count,
        })

    return result


@router.get("/contracts", response_model=list[ContractResponse])
def list_landlord_contracts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    properties = db.query(Property).filter(
        Property.landlord_name == current_user.full_name
    ).all()
    property_ids = [p.id for p in properties]

    contracts = db.query(Contract).filter(
        Contract.property_id.in_(property_ids)
    ).all()

    result = []
    for c in contracts:
        prop = db.query(Property).filter(Property.id == c.property_id).first()
        result.append(ContractResponse(
            id=c.id,
            property_id=c.property_id,
            property_title=prop.title if prop else "Imóvel removido",
            tenant_id=c.tenant_id,
            landlord_id=c.landlord_id,
            rent_value=c.rent_value,
            status=c.status,
            start_date=c.start_date,
            solana_tx_hash=c.solana_tx_hash,
        ))

    return result


@router.patch("/contracts/{contract_id}/accept")
def accept_contract(
    contract_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contrato não encontrado")

    property = db.query(Property).filter(Property.id == contract.property_id).first()
    if not property or property.landlord_name != current_user.full_name:
        raise HTTPException(status_code=403, detail="Não autorizado")

    if contract.status != "pending":
        raise HTTPException(status_code=400, detail="Contrato não está pendente")

    contract.status = "active"
    db.commit()

    return {"message": "Contrato aceito", "contract_id": contract.id}


@router.patch("/contracts/{contract_id}/reject")
def reject_contract(
    contract_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contrato não encontrado")

    property = db.query(Property).filter(Property.id == contract.property_id).first()
    if not property or property.landlord_name != current_user.full_name:
        raise HTTPException(status_code=403, detail="Não autorizado")

    if contract.status != "pending":
        raise HTTPException(status_code=400, detail="Contrato não está pendente")

    contract.status = "cancelled"
    db.commit()

    return {"message": "Contrato recusado", "contract_id": contract.id}
