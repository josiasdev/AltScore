from pydantic import BaseModel
from datetime import datetime


class ContractCreate(BaseModel):
    property_id: int


class ContractResponse(BaseModel):
    id: int
    property_id: int
    property_title: str
    tenant_id: int
    landlord_id: int | None = None
    rent_value: float
    status: str
    start_date: datetime
    solana_tx_hash: str | None = None

    class Config:
        from_attributes = True
