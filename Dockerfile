# Defaulter til Dockerhub
FROM python

# Kopierer filer til root
COPY fotball_backend.py ./
COPY team_fixtures ./
COPY requirements.txt ./

# Installerer pakker
RUN pip install -r requirements.txt

# Eksponerer en port slik at man kan nå appen fra utenfor containeren (?)
EXPOSE 80

# Kjører
CMD ["python", "react-playground-backend.py"]