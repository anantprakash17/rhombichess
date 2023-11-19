setup-backend:
	cd src/server && \
		python3 -m venv venv && \
		source venv/bin/activate && \
		pip install -r requirements.txt

clean-backend:
	rm -rf src/server/venv

setup-client:
	cd src/client && \
		npm install

clean-client:
	rm -rf src/client/node_modules

clean-all: clean-backend clean-client

