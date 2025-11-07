# Hack The Box — Meow (Starting Point)
**Author:** Manoj Bajgai  
**Platform:** Hack The Box (Starting Point — Pwnbox)  
**Date:** 2025-11-07  
**Difficulty:** Beginner  
**Objective:** Learn Pwnbox/VPN setup, perform basic enumeration with `nmap`, access a remote service (telnet), and capture the machine flag.

---

## Summary
This is my write-up for the *Meow* machine in the Hack The Box Starting Point. The lab teaches how to connect using Pwnbox, perform basic network enumeration, discover a telnet service, and gain a foothold by authenticating with a default/weak account. The final goal is to read the `flag.txt` file.

---

## Environment & Setup
- **Connection method:** Pwnbox (browser-based HTB VM) — recommended for Starting Point.  
- **Target IP:** `10.129.xxx.xxx` (your lab will provide a specific IP)  
- **Tools used:** Terminal (bash), `ping`, `nmap`, `telnet`, `ls`, `cat`

> Note: I used HTB’s Pwnbox for simplicity. If you prefer, you can connect using a local VM + OpenVPN, but Pwnbox removes extra setup friction.

---

## Initial Connectivity
After spawning the Meow machine and copying its IP, I verified connectivity:

```bash
ping <TARGET_IP>
# (Press CTRL+C to stop ping)
