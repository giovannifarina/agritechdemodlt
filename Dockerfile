FROM ubuntu:latest

# Install any additional packages you might need
# Install necessary tools and Python 3.12
RUN apt-get update && apt-get install -y \
    curl \
    git \
    nano \
    vim \
    build-essential \
    software-properties-common \
    && add-apt-repository ppa:deadsnakes/ppa \
    && apt-get update \
    && apt-get install -y python3.12 python3.12-venv python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Set Python 3.12 as the default python3
RUN update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.12 1

# Install NVM
ENV NVM_DIR=/root/.nvm
ENV NODE_VERSION=18.17.0

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

# Add NVM to PATH
ENV PATH=$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

RUN npm install -g node-gyp
RUN npm install -g web3
RUN npm install -g truffle


# Set the working directory
WORKDIR /root

# Keep the container running
CMD ["/bin/bash"]