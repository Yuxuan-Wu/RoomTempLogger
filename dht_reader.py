import time
import board
import adafruit_dht
import sys
import json

dhtDevice = adafruit_dht.DHT22(board.D4)

def get_reading(retries=5, delay_seconds=1):
    for retry in range(retries):
        try:
            temperature_c = dhtDevice.temperature
            humidity = dhtDevice.humidity
            return temperature_c, humidity
        except RuntimeError:
            time.sleep(delay_seconds)
    return None, None

while True:
    temperature_c, humidity = get_reading()
    if temperature_c is not None:
        sys.stdout.write(json.dumps({"temperature": temperature_c, "humidity": humidity}))
        sys.stdout.flush()
    time.sleep(5.0)