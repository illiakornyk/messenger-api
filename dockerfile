FROM node:20

WORKDIR /usr/src/app

# Installing netcat for use in entrypoint.sh to check database availability
RUN apt-get update && apt-get install -y netcat-traditional && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Copy the entrypoint script and make it executable
COPY ./scripts/entrypoint.sh .
RUN chmod +x ./entrypoint.sh

EXPOSE 3000
# Defining the entrypoint for launching migrations before starting the application
ENTRYPOINT ["./entrypoint.sh"]ʼ

# Default command for launching the production version of the application
CMD ["npm", "run", "start:prod"]
