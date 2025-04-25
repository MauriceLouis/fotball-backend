# Defaulter til Dockerhub
FROM python

# Oppretter en workdir
WORKDIR /app

# Kopierer filer til root
COPY fotball_backend.py ./
COPY team_fixtures /app/team_fixtures
COPY requirements.txt ./

# Installerer pakker
RUN pip install -r requirements.txt

# Kjører
CMD ["python", "/app/fotball_backend.py"]