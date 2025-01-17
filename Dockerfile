# Use Python 3.11.5 image as base
FROM python:3.11.5
# Set working directory to current directory
COPY . /app
WORKDIR /app

# Install necessary packages
RUN apt-get --fix-missing update && \
    apt-get install -y npm

COPY requirements.txt .
RUN apt-get install libasound-dev libportaudio2 libportaudiocpp0 portaudio19-dev -y
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install git+https://github.com/openai/whisper.git

# Copy project files to container
COPY . .

RUN npm install yarn
RUN npm install 

#RUN npm run dev -- --host & \
#    sleep 10 && \
#    pytest api/tests && \
    
RUN echo -e "#!/bin/sh\n\
npm run dev -- --host &\n\
sleep 10\n\
pytest api/tests\n\
kill \$(jobs -p)" > run_tests.sh && \
    chmod +x run_tests.sh
# Expose necessary port
EXPOSE 5000 3001 8000 8888

# Start flask app and run npm dev server
CMD ["npm", "run", "production", "--", "--host"]
