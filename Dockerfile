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

# Eksponerer en port slik at man kan nå appen fra utenfor containeren (?)
EXPOSE 8080

# Kjører
CMD ["python", "/app/fotball_backend.py"]