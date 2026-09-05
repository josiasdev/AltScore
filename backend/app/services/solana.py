"""Solana service - Registra scores e contratos na blockchain Solana"""
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


def ensure_keypair():
    os.makedirs(os.path.dirname(KEYPAIR_PATH), exist_ok=True)
    if not os.path.exists(KEYPAIR_PATH):
        env = os.environ.copy()
        env["PATH"] = f"{SOLANA_PATH}:{env.get('PATH', '')}"
        result = subprocess.run(
            ["solana-keygen", "new", "--outfile", KEYPAIR_PATH, "--no-bip39-passphrase", "--force"],
            capture_output=True,
            text=True,
            env=env,
        )
        if result.returncode != 0:
            raise RuntimeError(f"Keypair generation failed: {result.stderr}")
    return KEYPAIR_PATH


def airdrop(address: str = None, lamports: int = 2_000_000_000):
    keypair = ensure_keypair()
    if not address:
        result = subprocess.run(
            ["solana", "address", "--keypair", keypair, "--url", SOLANA_RPC],
            capture_output=True, text=True,
        )
        address = result.stdout.strip()

    subprocess.run(
        ["solana", "airdrop", str(lamports / 1_000_000_000), address, "--url", SOLANA_RPC],
        capture_output=True, text=True,
    )
    return address


def register_score_on_chain(score: int, level: str, user_pubkey: str = None) -> dict:
    keypair = ensure_keypair()
    if not user_pubkey:
        result = subprocess.run(
            ["solana", "address", "--keypair", keypair, "--url", SOLANA_RPC],
            capture_output=True, text=True,
        )
        user_pubkey = result.stdout.strip()

    print(f"[Solana] Registering score {score} ({level}) for {user_pubkey}")
    return {
        "status": "simulated",
        "program_id": PROGRAM_ID,
        "score": score,
        "level": level,
        "user": user_pubkey,
        "rpc": SOLANA_RPC,
    }


def create_contract_on_chain(contract_id: int, rent_value: int, landlord_pubkey: str, tenant_pubkey: str = None) -> dict:
    keypair = ensure_keypair()
    if not tenant_pubkey:
        result = subprocess.run(
            ["solana", "address", "--keypair", keypair, "--url", SOLANA_RPC],
            capture_output=True, text=True,
        )
        tenant_pubkey = result.stdout.strip()

    print(f"[Solana] Creating contract {contract_id} (rent={rent_value}) tenant={tenant_pubkey} landlord={landlord_pubkey}")
    return {
        "status": "simulated",
        "program_id": PROGRAM_ID,
        "contract_id": contract_id,
        "rent_value": rent_value,
        "tenant": tenant_pubkey,
        "landlord": landlord_pubkey,
        "rpc": SOLANA_RPC,
    }


def record_payment_on_chain(contract_id: int, amount: int, month: int, year: int) -> dict:
    print(f"[Solana] Recording payment contract={contract_id} amount={amount} month={month}/{year}")
    return {
        "status": "simulated",
        "program_id": PROGRAM_ID,
        "contract_id": contract_id,
        "amount": amount,
        "month": month,
        "year": year,
        "rpc": SOLANA_RPC,
    }
