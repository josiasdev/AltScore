from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.routes import auth_router, score_router, properties_router, contracts_router

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AltScore API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(score_router)
app.include_router(properties_router)
app.include_router(contracts_router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
