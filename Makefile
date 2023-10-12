setup-backend:
	cd src/backend && \
		python3 -m venv venv && \
		source venv/bin/activate && \
		pip install -r requirements.txt

clean-backend:
	rm -rf src/backend/venv

setup-frontend:
	cd src/frontend && \
		npm install

clean-frontend:
	rm -rf src/frontend/node_modules

clean-all: clean-backend clean-frontend

