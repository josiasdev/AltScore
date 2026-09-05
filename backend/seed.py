"""Seed script - Popula o banco com dados de exemplo em Quixadá, CE"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, SessionLocal, Base
from app.models.user import User, Property, Score
from app.utils.crypto import get_password_hash

# Create tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Check if already seeded
if db.query(Property).count() > 0:
    print("Banco já populado. Abortando seed.")
    db.close()
    exit(0)

# Create users
users = [
    User(
        email="ana@aluno.ufc.br",
        hashed_password=get_password_hash("123456"),
        full_name="Ana Beatriz Silva",
        role="tenant",
    ),
    User(
        email="proprietario@email.com",
        hashed_password=get_password_hash("123456"),
        full_name="Maria Oliveira",
        role="landlord",
    ),
    User(
        email="joao@ifce.edu.br",
        hashed_password=get_password_hash("123456"),
        full_name="João Pedro Santos",
        role="tenant",
    ),
]

db.add_all(users)
db.flush()

# Create properties in Quixadá, CE
properties = [
    Property(
        title="Apartamento 2 quartos - Centro",
        address="Rua São Paulo, 456 - Centro, Quixadá - CE",
        neighborhood="Centro",
        rent_value=850.00,
        bedrooms=2,
        bathrooms=1,
        area_m2=55,
        description="Apartamento amplo e arejado, próximo à praça principal. Ideal para estudantes da UFC e IFCE.",
        accepts_altscore=True,
        image_url="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        landlord_name="Maria Oliveira",
    ),
    Property(
        title="Casa 3 quartos - Planalto Universitário",
        address="Rua das Acácias, 123 - Planalto Universitário, Quixadá - CE",
        neighborhood="Planalto Universitário",
        rent_value=1200.00,
        bedrooms=3,
        bathrooms=2,
        area_m2=80,
        description="Casa em condomínio fechado, próximo ao campus da UFC. Churrasqueira e área de lazer.",
        accepts_altscore=True,
        image_url="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
        landlord_name="João Santos",
    ),
    Property(
        title="Studio mobiliado - Centro",
        address="Av. Presidente Vargas, 789 - Centro, Quixadá - CE",
        neighborhood="Centro",
        rent_value=650.00,
        bedrooms=1,
        bathrooms=1,
        area_m2=30,
        description="Studio mobiliado completo, ideal para solteiros. Próximo ao comércio e transporte público.",
        accepts_altscore=True,
        image_url="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
        landlord_name="Ana Costa",
    ),
    Property(
        title="Apartamento 3 quartos - Padre José Maria",
        address="Rua do Cipó, 321 - Padre José Maria, Quixadá - CE",
        neighborhood="Padre José Maria",
        rent_value=1100.00,
        bedrooms=3,
        bathrooms=2,
        area_m2=75,
        description="Apartamento familiar, condomínio com piscina e academia. Perto de escolas e hospitais.",
        accepts_altscore=False,
        image_url="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
        landlord_name="Carlos Ferreira",
    ),
    Property(
        title="Quarto em república - Estudantes",
        address="Rua dos Estudantes, 55 - Centro, Quixadá - CE",
        neighborhood="Centro",
        rent_value=350.00,
        bedrooms=1,
        bathrooms=1,
        area_m2=12,
        description="Quarto em república estudantil. Cozinha compartilhada. Perfeito para estudantes de faculdade.",
        accepts_altscore=True,
        image_url="https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800",
        landlord_name="República Sol Nascente",
    ),
    Property(
        title="Cobertura 2 quartos - Alto da Boa Vista",
        address="Rua da Boa Vista, 88 - Alto da Boa Vista, Quixadá - CE",
        neighborhood="Alto da Boa Vista",
        rent_value=1500.00,
        bedrooms=2,
        bathrooms=2,
        area_m2=90,
        description="Cobertura com vista panorâmica da cidade. Varanda gourmet e 2 vagas de garagem.",
        accepts_altscore=True,
        image_url="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
        landlord_name="Imobiliária Serra da Ibiapaba",
    ),
]

db.add_all(properties)
db.flush()

# Create score for Ana
score = Score(
    user_id=users[0].id,
    total=720,
    payment_score=280,
    income_score=180,
    finance_score=150,
    social_score=110,
    level="Bom",
    connected_sources="pix,subscriptions,open_finance",
)
db.add(score)

db.commit()
db.close()

print("Seed executado com sucesso!")
print(f"  - {len(users)} usuários criados")
print(f"  - {len(properties)} imóveis criados em Quixadá, CE")
print(f"  - 1 score de exemplo criado")
print("\nCredenciais de teste:")
print("  Email: ana@aluno.ufc.br | Senha: 123456")
print("  Email: proprietario@email.com | Senha: 123456")
