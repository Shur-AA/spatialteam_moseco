```bash
# Установка через venv
python3 -m venv .venv
source .venv/bin/activate # bash
.\.venv\Scripts\Activate.ps1 # PowerShell
pip install -r requirements.txt
uvicorn main:app --reload
```