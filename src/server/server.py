import argparse
import logging
from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler
from flask_cors import CORS
from app import app, socketio

CORS(app)

parser = argparse.ArgumentParser(description="set server mode")
parser.add_argument("--debug", action="store_true", help="enable debug logging")
args = parser.parse_args()

# log errors to stderr with gevent
log_level = logging.DEBUG if args.debug else logging.INFO
logging.basicConfig(level=log_level, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
log = logging.getLogger(__name__)

if __name__ == "__main__":
    http_server = WSGIServer(("0.0.0.0", 8080), app, handler_class=WebSocketHandler, log=log)
    try:
        http_server.serve_forever()
    except KeyboardInterrupt:
        log.info("Shutting down server")
        http_server.stop()
        log.info("Server stopped")
