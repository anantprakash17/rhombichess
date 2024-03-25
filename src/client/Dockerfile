FROM node:21
ARG NEXTAUTH_SECRET
ARG DB_PASSWORD
COPY ./app /usr/src/app
COPY ./components /usr/src/components
COPY ./lib /usr/src/lib
COPY ./prisma /usr/src/prisma
COPY ./public /usr/src/public
COPY .eslintrc.json constants.js next.config.js package.json tailwind.config.js package-lock.json postcss.config.js /usr/src/
WORKDIR /usr/src/
RUN echo "NEXTAUTH_URL=http://localhost:3000" >> .env && \
    echo "NEXTAUTH_SECRET=${NEXTAUTH_SECRET}" >> .env && \
    echo "DATABASE_URL=postgres://farzan.throw:${DB_PASSWORD}@ep-purple-limit-05785948.us-east-2.aws.neon.tech/neondb" >> .env && \
    echo "SHADOW_DATABASE_URL=postgres://farzan.throw:${DB_PASSWORD}@ep-purple-limit-05785948.us-east-2.aws.neon.tech/shadow" >> .env && \
    npm install && \
    npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
