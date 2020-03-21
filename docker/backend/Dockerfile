FROM python:3.6-slim-buster

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV FLASK_ENV production

RUN pip install gunicorn==20.0.4
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY epi_collect/api/ /app

RUN mkdir -p /var/log/gunicorn

EXPOSE 80
CMD ["gunicorn", \
     "-w", "4", \
     "--log-file", "/var/log/gunicorn/error.log", \
     "-b", "0.0.0.0:80", \
     "api:app"]