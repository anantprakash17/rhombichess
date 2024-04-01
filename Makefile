setup-basics:
	@if [ ! -f ./node/bin/node ] && [ -z `which npm` ]; then \
		echo "Node.js not found, installing..."; \
		uname -m | grep -q 'arm64' && \
		curl -o- https://nodejs.org/dist/v21.7.1/node-v21.7.1-darwin-arm64.tar.gz | tar xz -C ./node --strip-components=1 \
		|| \
		curl -o- https://nodejs.org/dist/v21.7.1/node-v21.7.1-darwin-x64.tar.gz | tar xz -C ./node --strip-components=1; \
	fi
	@if [ -z `which npm` ]; then \
		export PATH=$PATH:./node/bin; \
	fi

setup-backend:
	@if [ ! -d src/server/venv ]; then \
		echo "Setting up Python Virtual Environment..." && \
		cd src/server && \
		python3 -m venv venv && \
		source venv/bin/activate && \
		pip install -r ./app/requirements.txt > /dev/null 2>&1; \
	fi

setup-client:
	@if [ ! -d src/client/node_modules ]; then \
		echo "Setting up React Client..." && \
		cd src/client && \
		npm install > /dev/null 2>&1; \
	fi

setup: setup-basics setup-backend setup-client

build-frontend:
	@cd src/client && \
		if [ ! -f .next/BUILD_ID ]; then \
			echo "Building React Client..." && \
			npm run build; \
		else \
			echo "\033[33mBuild already exists. Skipping build. If you'd like to rebuild, rebuild using 'npm run build' in the client directory.\033[0m"; \
		fi

start: setup build-frontend
	@cd src/server && \
		source venv/bin/activate && \
		{ python3 server.py > /dev/null 2>&1 & echo $$! > ./server.pid; }
	@cd src/client && \
		{ npm run start > /dev/null 2>&1 & echo $$! > ./client.pid; }
	@[ -f src/client/client.pid ] && echo "React Server is running at http://localhost:3000"

stop:
	@kill `cat src/server/server.pid` || true
	@echo "Stopped Flask Server"
	@kill `cat src/client/client.pid` || true
	@echo "Stopped React Server"
	@rm src/server/server.pid src/client/client.pid || true
	@echo "Thanks for playing Rhombichess!"

clean-backend:
	rm -rf src/server/venv
	[ -d src/server/__pycache__ ] && rm -rf src/server/__pycache__ || true

clean-client:
	rm -rf src/client/node_modules
	[ -d src/client/node ] && rm -rf src/client/node || true
	[ -d src/client/.next ] && rm -rf src/client/.next || true

clean-all: clean-backend clean-client

