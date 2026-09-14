FROM python:3.13-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && useradd --uid 10001 --create-home directors-cut && mkdir /data && chown directors-cut /data
COPY backend/app.py backend/test_app.py ./
COPY public/data/comparisons/ /app/seed/
RUN python -m unittest -q test_app
USER directors-cut
ENV DATA_DIR=/data PORT=18100
EXPOSE 18100
HEALTHCHECK --interval=15s --timeout=5s --start-period=15s --retries=4 CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:18100/health',timeout=3)"
CMD ["python", "app.py", "--log-level", "WARN"]
