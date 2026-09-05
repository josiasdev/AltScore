from pydantic import BaseModel


class PropertyResponse(BaseModel):
    id: int
    title: str
    address: str
    neighborhood: str
    rent_value: float
    bedrooms: int
    bathrooms: int
    area_m2: int
    description: str
    accepts_altscore: bool
    image_url: str
    landlord_name: str

    class Config:
        from_attributes = True
