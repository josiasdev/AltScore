from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User, Property, Contract
from app.schemas.contract import ContractCreate, ContractResponse
from app.utils.crypto import get_current_user

router = APIRouter(prefix="/api/contracts", tags=["contracts"])


@router.get("", response_model=list[ContractResponse])
def list_contracts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    contracts = db.query(Contract).filter(
        Contract.tenant_id == current_user.id
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


@router.post("", response_model=ContractResponse)
def create_contract(
    data: ContractCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    property = db.query(Property).filter(Property.id == data.property_id).first()
    if not property:
        raise HTTPException(status_code=404, detail="Imóvel não encontrado")

    existing = db.query(Contract).filter(
        Contract.tenant_id == current_user.id,
        Contract.property_id == data.property_id,
        Contract.status.in_(["pending", "active"]),
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Você já tem um contrato ativo para este imóvel")

    contract = Contract(
        property_id=data.property_id,
        tenant_id=current_user.id,
        rent_value=property.rent_value,
        status="pending",
    )
    db.add(contract)
    db.commit()
    db.refresh(contract)

    return ContractResponse(
        id=contract.id,
        property_id=contract.property_id,
        property_title=property.title,
        tenant_id=contract.tenant_id,
        landlord_id=contract.landlord_id,
        rent_value=contract.rent_value,
        status=contract.status,
        start_date=contract.start_date,
        solana_tx_hash=contract.solana_tx_hash,
    )
