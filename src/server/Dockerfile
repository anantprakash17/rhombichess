FROM python:3.12-slim
RUN apt-get update --yes && \
    apt-get upgrade --yes && \
    apt-get install --yes --no-install-recommends \
    python3-dev \
    gcc && \
    apt-get clean && rm -rf /var/lib/apt/lists/*
COPY ./app /app
COPY ./server.py /server.py
RUN pip install -r /app/requirements.txt
EXPOSE 8080
CMD ["python", "/server.py"]
