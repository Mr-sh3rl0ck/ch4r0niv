---
title: "HackTheBox: Spookifier Writeup"
date: "2026-04-29"
excerpt: "A deep dive into the SSTI vulnerability found in the Spookifier web challenge. We explore server-side template injection in Mako templates and demonstrate full exploitation."
tags: ["htb", "web", "ssti", "writeup"]
category: "Writeups"
image: "/images/spook.jpeg"
---


# Spookifier Analysis

During the analysis of the Spookifier application, a critical vulnerability was discovered.

## The Vulnerability

The application takes user input and renders it directly into a template without proper sanitization. This leads to Server-Side Template Injection (SSTI).

### Payload

```python
${7*7}
```

When injecting this payload, the application evaluated it to `49`, confirming the presence of Mako SSTI.

## Exploitation

We can leverage this to execute arbitrary code on the server:

```python
${self.module.cache.util.os.popen('cat flag.txt').read()}
```

> "Security is an illusion." - Cypher

Stay tuned for more web exploitation writeups!
