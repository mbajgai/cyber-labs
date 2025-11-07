# TryHackMe — Example Room
**Date:** 2025-11-07  
**Difficulty:** Beginner  
**Objective:** Practice basic enumeration and SSH access.

## Environment / Tools
- Tools used: nmap, ssh, enum4linux

## Recon
- `nmap -sC -sV -oN nmap_initial.txt 10.10.10.5`
- Open ports: 22 (ssh), 80 (http)

## Exploitation / Access
- Discovered default creds via web form → ssh login as `user`
- `ssh user@10.10.10.5`

## Privilege Escalation
- Found sudo permissions for a specific script → used to escalate

## Lessons Learned
- Always check sudo rights and weak web forms
- Harden web inputs and avoid default credentials

## References
- TryHackMe room page
