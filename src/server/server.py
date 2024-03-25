import logging
from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler
from flask_cors import CORS
from app import app, socketio

CORS(app)

# log errors to stderr with gevent
logging.basicConfig(level=logging.ERROR, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
log = logging.getLogger(__name__)

if __name__ == "__main__":
    http_server = WSGIServer(("0.0.0.0", 8080), app, handler_class=WebSocketHandler, log=log)
    try:
        http_server.serve_forever()
    except KeyboardInterrupt:
        log.info("Shutting down server")
        http_server.stop()
        log.info("Server stopped")
