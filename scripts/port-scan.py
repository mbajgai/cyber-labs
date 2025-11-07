#!/usr/bin/env python3
# Simple educational port scanner - only use on your own networks
import socket

def scan(host, ports):
    for port in ports:
        s = socket.socket()
        s.settimeout(0.5)
        try:
            s.connect((host, port))
            print(f"[+] Open: {port}")
        except:
            pass
        finally:
            s.close()

if __name__ == "__main__":
    target = "127.0.0.1"
    scan(target, [22, 80, 443])
