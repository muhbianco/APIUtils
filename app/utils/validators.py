from datetime import date, datetime

from fastapi import HTTPException

def validate_date(date_str: str):
    if isinstance(date_str, date):
        return date_str
    for fmt in ("%d/%m/%Y", "%d-%m-%Y", "%Y-%m-%d", "%Y/%m/%d"):
        try:
            return datetime.strptime(date_str, fmt).date()
        except ValueError:
            continue
    raise HTTPException(status_code=400, detail=f"A data '{date_str}' não está no formato dd/mm/aaaa ou dd-mm-aaaa")