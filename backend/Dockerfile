FROM python:3.9.13-slim

WORKDIR /server

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

COPY . .

EXPOSE 5000

CMD ["python", "app.py"]