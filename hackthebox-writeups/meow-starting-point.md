# Hack The Box — Meow (Starting Point)
**Author:** Manoj Bajgai  
**Platform:** Hack The Box (Starting Point — Pwnbox)  
**Date:** 2025-11-07  
**Difficulty:** Beginner  
**Objective:** Learn Pwnbox/VPN setup, confirm connectivity, perform basic enumeration with `nmap`, access a remote service (telnet) in a lab, and capture the machine flag.

---

## TL;DR
Used Pwnbox to connect, verified connectivity with `ping`, enumerated services with `nmap`, found `telnet` on port 23, logged in with a blank `root` password, and read `flag.txt`.

---

## Summary
This is my write-up for the *Meow* machine in the Hack The Box Starting Point. The exercise demonstrates connecting via Pwnbox, basic network enumeration, discovering a telnet service, and gaining a foothold on an intentionally vulnerable lab machine. The objective was to locate and read the `flag.txt` file.

---

## Environment & Setup
- **Connection method:** Pwnbox (browser-based HTB VM) — recommended for Starting Point.  
- **Target IP:** `<TARGET_IP>` (replace with lab IP)  
- **Tools used:** Terminal (bash), `ping`, `nmap`, `telnet` (or `nc`), `ls`, `cat`  
> Note: I used HTB’s Pwnbox for simplicity. Local VM + OpenVPN is an alternative.

---

## 1) Initial Connectivity — `ping`
**Purpose:** Quickly confirm the target is reachable and measure round-trip time.

**Command (macOS / Linux):**
```bash
ping -c 4 <TARGET_IP>
````

**Command (Windows):**

```powershell
ping -n 4 <TARGET_IP>
```

**Example result format:**

```
PING 10.129.x.x (10.129.x.x): 56 data bytes
64 bytes from 10.129.x.x: icmp_seq=0 ttl=64 time=12.3 ms
64 bytes from 10.129.x.x: icmp_seq=1 ttl=64 time=11.8 ms
64 bytes from 10.129.x.x: icmp_seq=2 ttl=64 time=11.6 ms
64 bytes from 10.129.x.x: icmp_seq=3 ttl=64 time=12.0 ms

--- 10.129.x.x ping statistics ---
4 packets transmitted, 4 packets received, 0% packet loss
round-trip min/avg/max = 11.6/11.9/12.3 ms
```

**Interpretation:**

* **4/4 replies, 0% loss:** target reachable — proceed to `nmap`.
* **No replies:** ICMP may be blocked — use `nmap -Pn` for scanning.
* **Partial loss/high latency:** note it; continue with care.

**Write-up line example:**

```
ping -c 4 10.129.251.148  → 4/4 replies, avg 11.9 ms, 0% packet loss
```

---

## 2) Enumeration — `nmap`

**Purpose:** Identify open ports, running services and versions to determine attack surface.

**Command used:**

```bash
nmap -sC -sV -p- <TARGET_IP> -oN nmap_initial.txt
```

* `-p-` scans all ports.
* `-sC` runs default NSE scripts.
* `-sV` attempts version detection.
* `-oN` saves output to file.

**Example key output (lab):**

```
23/tcp   open   telnet    syn-ack
80/tcp   open   http      Apache httpd 2.4.x
```

**If ICMP is blocked:**

```bash
nmap -Pn -sC -sV <TARGET_IP>
```

---

## 3) Investigating Telnet (lab-only)

**Context:** Telnet is unencrypted and often intentionally vulnerable in labs.

**Connect:**

```bash
telnet <TARGET_IP> 23
# if telnet not installed:
nc <TARGET_IP> 23
```

**Lab-safe approach:**

1. Observe banner/prompt.
2. Try common usernames in labs: `admin`, `administrator`, `root`.
3. Try blank password for lab accounts (only in authorised labs).
4. If shell access gained, list files and search for flag files:

```bash
ls -la
cat flag.txt
```

**Example session (lab):**

```
telnet 10.129.251.148 23
# login: root
# password: [press enter]
ls
cat flag.txt
```

**Important:** Only perform these steps in authorised lab environments (HTB, TryHackMe, local VMs). Never target production systems without written permission.

---

## 4) Foothold & Success

* Logged in as `root` with blank password on telnet (lab condition).
* Located `flag.txt` and displayed it with `cat flag.txt`.
* Objective achieved for the Starting Point lab.

---

## 5) Lessons Learned

* Always start with connectivity checks (`ping`) and service enumeration (`nmap`).
* Legacy services like telnet can provide easy footholds in lab environments; understanding them helps both attacker and defender thinking.
* Clear documentation of commands and outputs is vital for reproducibility and reporting.

---

## 6) Defensive / Remediation Notes

If this were a production device, recommended actions:

* Disable telnet; use SSH with strong authentication (keys + strong passphrases).
* Remove or disable default accounts and set strong password policies.
* Restrict management interfaces to a dedicated management network (segmentation).
* Monitor logs and set alerts for failed login attempts and unusual access.
* Keep software and firmware updated and follow vendor hardening guides.

---

## 7) References

* Hack The Box — Meow (Starting Point) lab page
* Nmap documentation (`man nmap`)
* HTB Academy — Pwnbox & Starting Point materials

---

**Disclaimer:** This write-up documents actions performed on an authorised Hack The Box lab environment. Do not attempt these steps on systems you do not own or have explicit permission to test.
