FROM thyrlian/android-sdk

COPY . /src
WORKDIR /src

RUN apt-get update && apt-get install curl --yes
RUN curl -sL https://raw.githubusercontent.com/nodesource/distributions/master/deb/setup_9.x | bash
RUN apt-get install -y nodejs
RUN npm i -g yarn
RUN yarn install
RUN git clone https://github.com/first-recon/recon-app.git

EXPOSE 80

CMD ["npm", "start"]