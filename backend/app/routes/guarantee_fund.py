from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.utils.crypto import get_current_user
from app.services.guarantee_fund import (
    get_fund_status,
    get_fund_history,
    deposit_to_fund,
    claim_coverage,
)

router = APIRouter(prefix="/api/fund", tags=["guarantee-fund"])


@router.get("/status")
def fund_status():
    """Retorna o status atual do fundo garantidor"""
    return get_fund_status()


@router.get("/history")
def fund_history():
    """Retorna o histórico de transações do fundo"""
    return get_fund_history()


@router.post("/deposit")
def deposit_fund(
    amount: int,
    current_user: User = Depends(get_current_user),
):
    """
    Depósito no fundo garantidor.
    
    Args:
        amount: Valor em lamports (1 SOL = 1_000_000_000 lamports)
    """
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Valor deve ser maior que zero")
    
    # Usar a public key do wallet se disponível, senão usar o email
    pubkey = current_user.solana_public_key or current_user.email
    
    result = deposit_to_fund(pubkey, amount)
    return result


@router.post("/claim")
def claim_fund(
    contract_id: int,
    claim_amount: int,
    reason: str,
    current_user: User = Depends(get_current_user),
):
    """
    Reivindicação de cobertura do fundo.
    
    Args:
        contract_id: ID do contrato
        claim_amount: Valor reivindicado em lamports
        reason: Motivo da reivindicação
    """
    if claim_amount <= 0:
        raise HTTPException(status_code=400, detail="Valor deve ser maior que zero")
    
    if not reason:
        raise HTTPException(status_code=400, detail="Motivo é obrigatório")
    
    pubkey = current_user.solana_public_key or current_user.email
    
    result = claim_coverage(pubkey, contract_id, claim_amount, reason)
    return result


@router.get("/rules")
def fund_rules():
    """Retorna as regras do fundo garantidor"""
    return {
        "coverage_limit": {
            "value": 5_000_000_000,
            "description": "Limite máximo de cobertura por contrato (5 SOL)",
        },
        "fee_percentage": {
            "value": 250,
            "description": "Taxa de administração (2.5% em basis points)",
        },
        "min_score_required": {
            "value": 600,
            "description": "Score mínimo para acesso ao fundo",
        },
        "eligible_claims": [
            "Inadimplência do inquilino (não pagamento de aluguel)",
            "Danos ao imóvel além do normal (comprovação necessária)",
            "Despejo judicial com custas comprovadas",
        ],
        "claim_process": [
            "1. Proprietário identifica inadimplência",
            "2. Registra claim no sistema com comprovação",
            "3. Fundo avalia e aprova/rejeita",
            "4. Pagamento é transferido para o proprietário",
            "5. Valor é deduzido do saldo do fundo",
        ],
        "transparency": "Todas as transações são registradas na blockchain Solana e podem ser verificadas publicamente.",
    }
