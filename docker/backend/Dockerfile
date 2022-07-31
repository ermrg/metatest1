
FROM python:3.8.0

ENV PYTHONUNBUFFERED 1
WORKDIR /app
ADD ./backend/requirements.txt /app/backend/

RUN pip install --upgrade pip

RUN pip install gunicorn
RUN pip install -r /app/backend/requirements.txt

ADD ./docker /app/docker
ADD ./backend /app/backend