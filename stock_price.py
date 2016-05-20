import argparse
import csv
import json
import datetime
from threading import Timer, Thread
from datetime import timedelta
from flask import Flask, request, make_response, current_app
from functools import update_wrapper
from yahoo_finance import Share
import os
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.heroku import Heroku


class SymbolInfo:
    def __init__(self, symbol):
        self.symbol = symbol
        self.price = []

class PriceCollector:
    def __init__(self, symbols):
        self.symbol_info_map = {}
        for symbol in symbols:
            self.symbol_info_map[symbol] = SymbolInfo(symbol)
        self.thread = None
        self.refresh_timeout = 2

    def start(self):
        if self.thread is None:
            self.thread = Timer(self.refresh_timeout, self.get_price)
            self.thread.start()

    def stop(self):
        if self.thread is not None:
            self.thread.cancel()
            self.thread = None

    def get_price(self):
        for symbol in self.symbol_info_map.keys():
            share = Share(symbol)
            self.symbol_info_map[symbol].price.append(share.get_price())
        self.thread = Timer(self.refresh_timeout, self.get_price)
        self.thread.start()

app = Flask(__name__)

heroku = Heroku(app)
db = SQLAlchemy(app)

class Symbol(db.Model):
    __tablename__ = "symbol"
    id = db.Column(db.Integer, primary_key=True)
    stock = db.Column(db.String(),unique=True)
    price = db.Column(db.String())

    def __init__(self, stock, price):
        self.stock = stock
        self.price = price
def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator


@app.route("/")
def hello():
    return "backend running"
@app.route('/price', methods=['GET'])
@crossdomain(origin='*')
def get_symbol_price():
    symbol = request.args["symbol"]
    global price_collector
    value = price_collector.symbol_info_map[symbol].price
    print value
    details = Symbol(symbol,value)
    db.session.add(details)
    db.session.commit()
    return json.dumps({
        "symbol": symbol,
        "price": price_collector.symbol_info_map[symbol].price
    })

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--symbol_file", required=True)
    args = parser.parse_args()
    port = int(os.environ.get("PORT", 5000))

    with open(args.symbol_file) as symbol_file:
        symbols = [symbol_info["stock"] for symbol_info in
                   json.load(symbol_file)]
    global price_collector
    price_collector = PriceCollector(symbols)
    price_collector.start()
    #app.run(debug=True,port=2320)
    app.run(host='0.0.0.0', port=port)
    price_collector.stop()
