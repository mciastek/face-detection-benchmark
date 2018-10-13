FROM node:8.12.0

ENV OPENCV_VERSION="3.4.3"
ENV OPENCV4NODEJS_DISABLE_AUTOBUILD=1
ENV WITH_CONTRIB=y

# Create directories and ensure good permissions
RUN chown -R root /opt
RUN chmod 755 /usr/local/bin/*

RUN mkdir -p /app
ENV PATH "$PATH:/app/node_modules/.bin"

RUN apt-get update && apt-get install -y --no-install-recommends \
  git \
  unzip \
  cmake \
  libv4l-dev \
  beignet-dev \
  opencl-headers \
  \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/local
RUN curl -SLO "https://github.com/opencv/opencv/archive/${OPENCV_VERSION}.tar.gz" \
  && tar -xzvf ${OPENCV_VERSION}.tar.gz \
  && mv /usr/local/opencv-${OPENCV_VERSION} /usr/local/opencv \
  && rm ${OPENCV_VERSION}.tar.gz

RUN mkdir /usr/local/opencv/build
WORKDIR /usr/local/opencv/build
RUN cmake -D CMAKE_BUILD_TYPE=RELEASE \
  -D BUILD_PYTHON_SUPPORT=ON \
  -D CMAKE_INSTALL_PREFIX=/usr/local \
  -D WITH_OPENGL=ON \
  -D WITH_TBB=OFF \
  -D BUILD_EXAMPLES=ON \
  -D BUILD_NEW_PYTHON_SUPPORT=ON \
  -D WITH_V4L=ON \
  -D WITH_OPENCL=ON \
  ..

RUN make -j7
RUN make install
WORKDIR /app

RUN apt-get update && apt-get install -y \
  libjpeg-dev \
  libpng12-dev

# npm install
COPY package.json yarn.lock /tmp/
RUN cd /tmp && \
  OPENCV4NODEJS_DISABLE_AUTOBUILD=1 yarn install -d --frozen-lockfile && \
  yarn cache clean && \
  mv /tmp/node_modules /app/

RUN apt-get purge -y \
  automake \
  autoconf \
  gcc \
  g++ \
  make python \
  git \
  unzip \
  cmake \
  libv4l-dev \
  beignet-dev \
  opencl-headers

ENV PORT=8080
ENV NODE_ENV=production
ARG ENV_FILE=production

# Copy app
WORKDIR /app

COPY . /app/
COPY ./.env.$ENV_FILE /app/.env
RUN yarn build

USER node

CMD yarn start
