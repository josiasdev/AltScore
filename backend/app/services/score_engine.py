import hashlib
import json
from datetime import datetime


class ScoreEngine:
    """
    Score de 0 a 1000 baseado em:
    - Historico de pagamento (40%) → 0-400
    - Consistencia de renda (25%) → 0-250
    - Dados open finance (20%) → 0-200
    - Avaliacao social (15%) → 0-150
    """

    def calculate(self, user_id: int, connected_sources: list[str]) -> dict:
        payment = self._payment_score(user_id, connected_sources)
        income = self._income_score(connected_sources)
        finance = self._finance_score(connected_sources)
        social = self._social_score(connected_sources)

        total = payment + income + finance + social

        score_hash = hashlib.sha256(
            json.dumps({
                "user_id": user_id,
                "score": total,
                "timestamp": datetime.now().isoformat()
            }).encode()
        ).hexdigest()

        return {
            "total": total,
            "breakdown": {
                "payment": payment,
                "income": income,
                "finance": finance,
                "social": social,
            },
            "level": self._get_level(total),
            "connected_sources": connected_sources,
            "score_hash": score_hash,
        }

    def _payment_score(self, user_id: int, sources: list[str]) -> int:
        if "pix" in sources:
            return 280
        if "subscriptions" in sources:
            return 200
        return 100

    def _income_score(self, sources: list[str]) -> int:
        if "open_finance" in sources:
            return 180
        return 60

    def _finance_score(self, sources: list[str]) -> int:
        if "open_finance" in sources:
            return 150
        return 50

    def _social_score(self, sources: list[str]) -> int:
        """
        Score social (0-150) baseado em:
        - Referências de proprietários anteriores (0-50)
        - Tempo de residência estável (0-30)
        - Avaliações de vizinhos/comunidade (0-40)
        - Presença em redes sociais verificáveis (0-30)
        """
        base_score = 60  # Score mínimo para todos os usuários

        # Referências de proprietários anteriores
        references_score = 30  # Simulado: proprietário de confiança

        # Estabilidade de residência
        stability_score = 20  # Simulado: tempo residindo

        # Avaliações da comunidade
        community_score = 25  # Simulado: avaliações positivas

        # Presença digital verificável
        digital_presence_score = 15  # Simulado: redes sociais

        total = base_score + references_score + stability_score + community_score + digital_presence_score
        return min(total, 150)  # Limitado a 150

    def _get_level(self, score: int) -> str:
        if score >= 800:
            return "Excelente"
        if score >= 600:
            return "Bom"
        if score >= 400:
            return "Regular"
        return "Iniciante"


score_engine = ScoreEngine()
