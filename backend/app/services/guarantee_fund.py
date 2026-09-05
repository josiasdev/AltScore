"""Serviço do Fundo Garantidor - Integração com Solana"""
import json
import subprocess
import os

SOLANA_RPC = "https://api.devnet.solana.com"
PROGRAM_ID = "9muywZZ7xaLb9cLVrWd9iLnUe6asSMndQ2Z4NhZwXuzg"
KEYPAIR_PATH = os.path.join(os.path.dirname(__file__), "../../solana-keypair.json")
SOLANA_PATH = os.path.expanduser("~/.local/share/solana/install/active_release/bin")


def _run_solana_command(args: list[str]) -> str:
    env = os.environ.copy()
    env["PATH"] = f"{SOLANA_PATH}:{env.get('PATH', '')}"
    result = subprocess.run(
        ["solana"] + args + ["--url", SOLANA_RPC, "--output", "json"],
        capture_output=True,
        text=True,
        env=env,
    )
    if result.returncode != 0:
        raise RuntimeError(f"Solana CLI error: {result.stderr}")
    return result.stdout


def initialize_fund(coverage_limit: int, fee_percentage: int, min_score_required: int) -> dict:
    """
    Inicializa o fundo garantidor na blockchain.
    
    Args:
        coverage_limit: Limite máximo de cobertura por contrato (em lamports)
        fee_percentage: Taxa de administração em basis points (250 = 2.5%)
        min_score_required: Score mínimo para acesso ao fundo
    """
    print(f"[Solana] Initializing fund: coverage={coverage_limit}, fee={fee_percentage}bps, min_score={min_score_required}")
    
    return {
        "status": "simulated",
        "program_id": PROGRAM_ID,
        "action": "initialize_fund",
        "coverage_limit": coverage_limit,
        "fee_percentage": fee_percentage,
        "min_score_required": min_score_required,
        "rpc": SOLANA_RPC,
    }


def deposit_to_fund(depositor_pubkey: str, amount: int) -> dict:
    """
    Registra um depósito no fundo garantidor.
    
    Args:
        depositor_pubkey: PublicKey do depositante
        amount: Valor em lamports
    """
    print(f"[Solana] Deposit to fund: {depositor_pubkey} deposited {amount} lamports")
    
    return {
        "status": "simulated",
        "program_id": PROGRAM_ID,
        "action": "deposit_to_fund",
        "depositor": depositor_pubkey,
        "amount": amount,
        "rpc": SOLANA_RPC,
    }


def claim_coverage(
    claimant_pubkey: str,
    contract_id: int,
    claim_amount: int,
    reason: str,
) -> dict:
    """
    Registra uma reivindicação de cobertura do fundo.
    
    Args:
        claimant_pubkey: PublicKey do reivindicante (proprietário)
        contract_id: ID do contrato
        claim_amount: Valor reivindicado em lamports
        reason: Motivo da reivindicação
    """
    # Calcular taxa (2.5% = 250 basis points)
    fee = int(claim_amount * 250 / 10000)
    payout = claim_amount - fee
    
    print(f"[Solana] Claim coverage: contract={contract_id}, amount={claim_amount}, fee={fee}, payout={payout}")
    
    return {
        "status": "simulated",
        "program_id": PROGRAM_ID,
        "action": "claim_coverage",
        "claimant": claimant_pubkey,
        "contract_id": contract_id,
        "claim_amount": claim_amount,
        "fee": fee,
        "payout": payout,
        "reason": reason,
        "rpc": SOLANA_RPC,
    }


def get_fund_status() -> dict:
    """
    Retorna o status atual do fundo garantidor.
    """
    # Simular dados do fundo
    return {
        "status": "simulated",
        "is_active": True,
        "total_deposits": 50_000_000_000,  # 50 SOL
        "total_coverage_used": 12_000_000_000,  # 12 SOL
        "available_balance": 38_000_000_000,  # 38 SOL
        "coverage_limit": 5_000_000_000,  # 5 SOL por contrato
        "fee_percentage": 250,  # 2.5%
        "min_score_required": 600,
        "total_claims": 3,
        "approved_claims": 2,
        "pending_claims": 1,
        "rpc": SOLANA_RPC,
    }


def get_fund_history() -> list[dict]:
    """
    Retorna o histórico de transações do fundo.
    """
    return [
        {
            "id": 1,
            "type": "deposit",
            "amount": 20_000_000_000,
            "user": "Depositor 1",
            "timestamp": "2026-01-15T10:00:00Z",
        },
        {
            "id": 2,
            "type": "deposit",
            "amount": 15_000_000_000,
            "user": "Depositor 2",
            "timestamp": "2026-02-01T14:30:00Z",
        },
        {
            "id": 3,
            "type": "claim",
            "amount": 5_000_000_000,
            "fee": 125_000_000,
            "payout": 4_875_000_000,
            "contract_id": 1,
            "user": "Proprietário 1",
            "timestamp": "2026-02-20T09:15:00Z",
        },
        {
            "id": 4,
            "type": "deposit",
            "amount": 15_000_000_000,
            "user": "Depositor 3",
            "timestamp": "2026-03-01T11:00:00Z",
        },
        {
            "id": 5,
            "type": "claim",
            "amount": 3_500_000_000,
            "fee": 87_500_000,
            "payout": 3_412_500_000,
            "contract_id": 3,
            "user": "Proprietário 2",
            "timestamp": "2026-03-10T16:45:00Z",
        },
        {
            "id": 6,
            "type": "claim",
            "amount": 3_500_000_000,
            "fee": 87_500_000,
            "payout": 3_412_500_000,
            "contract_id": 2,
            "user": "Proprietário 1",
            "timestamp": "2026-04-05T08:30:00Z",
        },
    ]
