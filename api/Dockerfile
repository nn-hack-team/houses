FROM amd64/python:3.9-buster

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR src

RUN pip install --upgrade pip
COPY ./requirements.txt /src/requirements.txt
RUN pip install -r requirements.txt

COPY . /src

RUN pip install -e .

EXPOSE 8000:8000