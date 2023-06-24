import time
import sys

def get_temperature():
    i = 0
    while True:
        sys.stdout.write(str(i) + '\n')
        sys.stdout.flush()
        time.sleep(1)
        i += 1

if __name__ == "__main__":
    get_temperature()
