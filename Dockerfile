FROM node:12

COPY ./package.json ./

RUN npm ci --only=production && \
    npm i -g typescript

COPY ./ .
RUN npm run build && \
    rm -r ./src && \
    rm ormconfig.ts && \
    cp -r ./build/* ./

EXPOSE 8080

CMD ["node", "src"]