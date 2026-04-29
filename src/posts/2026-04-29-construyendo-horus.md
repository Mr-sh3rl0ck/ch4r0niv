---
title: "Construyendo Horus: Cómo desarrollamos un SIEM/XDR Open Source desde cero en 6 semanas"
date: "2026-04-20"
category: "Ciberseguridad"
tags: ["Ciberseguridad", "SIEM", "XDR", "Python", "OpenSource", "ArquitecturaDeSoftware", "MITRE", "InfoSec"]
image: "/project-cyberdashboard.png"
excerpt: "La respuesta es Horus. En este post, quiero compartir de qué va el Producto Mínimo Viable (MVP) de nuestra plataforma, la arquitectura que diseñamos y los problemas técnicos que resolvimos."
---

La ciberseguridad corporativa se enfrenta a un problema grave: el volumen de datos (logs) crece a un ritmo exponencial, pero las herramientas para analizarlos suelen tener costos prohibitivos basados en el volumen de ingesta, generando lo que muchos llamamos el "impuesto al dato". Además, la mayoría de las soluciones tradicionales son "cajas negras" propietarias que consumen demasiados recursos en las máquinas monitoreadas.

Ante este panorama, mi equipo y yo nos planteamos un reto técnico masivo: ¿Es posible construir un SIEM/XDR soberano, ligero y 100% Open Source en tan solo 6 semanas?

La respuesta es **Horus**. En este post, quiero compartir de qué va el Producto Mínimo Viable (MVP) de nuestra plataforma, la arquitectura que diseñamos y los problemas técnicos que resolvimos.

## ¿Qué es el MVP de Horus?

Horus no es solo un recolector de logs; es una plataforma de Detección y Respuesta Extendida (XDR). Para nuestro MVP, acotamos estrictamente el alcance a las capacidades defensivas más críticas para aportar valor inmediato.

El MVP se centra en **4 pilares fundamentales**:

1.  **File Integrity Monitoring (FIM)**: Desarrollamos un módulo criptográfico que calcula hashes (SHA256/MD5) de archivos en directorios críticos y los compara en tiempo real contra una base local en SQLite. Si un atacante modifica un archivo o inyecta malware, Horus lo detecta al instante.
2.  **Detección de Fuerza Bruta**: Nuestro motor ingiere los registros de autenticación (ej. SSH) y correlaciona los eventos en ventanas de tiempo. Si ocurren múltiples intentos fallidos en menos de un minuto, el sistema dispara una alerta.
3.  **Syscollector (Inventario de Sistemas)**: Recolectamos métricas vitales como uso de CPU, RAM, puertos abiertos y software instalado, permitiendo cruzar esta información con bases de datos de vulnerabilidades (NVD/CVE).
4.  **Respuesta Activa Automatizada (XDR)**: El sistema no solo alerta, sino que se defiende. Integramos capacidades para que el servidor central ordene a los agentes ejecutar scripts de mitigación (como bloquear una IP atacante en el firewall) en milisegundos, reduciendo el Tiempo Medio de Respuesta (MTTR) drásticamente.

## Arquitectura: Diseñando para la Escalabilidad

Construir un SIEM implica manejar grandes ráfagas masivas de eventos (Event Flooding). Para lograr que Horus no colapsara, diseñamos una arquitectura distribuida de alto rendimiento:

-   **Agentes Ultra-Ligeros (Endpoint)**: Programados en Python usando asincronía (`asyncio`). El requerimiento no funcional más estricto que nos impusimos fue que el agente debía consumir menos del 5% del CPU de la máquina víctima.
-   **Ingesta y Buffer (Leaky Bucket)**: Para evitar que un ataque sature la base de datos, implementamos **Redis** como una cola en memoria intermedia. Esto retiene los datos temporalmente y los procesa al ritmo que el backend puede soportar.
-   **Motor de Análisis y Backend**: Desarrollado con **FastAPI**, el core utiliza Expresiones Regulares (Regex) complejas para decodificar la telemetría y evaluar las reglas. Además, enriquecemos automáticamente cada alerta mapeándola con el framework **MITRE ATT&CK** para darle contexto táctico.
-   **Almacenamiento (Hot & Cold Storage)**: Orquestamos **OpenSearch** en contenedores Docker para indexar y buscar alertas rápidamente, mientras que los logs crudos se comprimen en disco para auditorías legales.
-   **Frontend y BFF**: Construimos una SPA (Single Page Application) en **React** con diseño "Dark Mode" para analistas SOC, comunicada de forma segura a través de una capa intermedia (BFF) en **Node.js** usando JSON Web Tokens (JWT).

## El Aprendizaje: Más allá del Código

A lo largo de estas 6 semanas, implementamos prácticas de ingeniería serias: desde flujos de trabajo con Gitflow y protección de ramas, hasta contenerización con Docker Compose para asegurar que el despliegue del SIEM sea "Plug & Play".

También aprendimos a gestionar riesgos reales mediante matrices AMEF/FMEA, resolviendo problemas como el consumo excesivo de memoria JVM en OpenSearch o la optimización asíncrona del cálculo de Hashes en los endpoints.

## Siguientes Pasos

Horus demuestra que la soberanía tecnológica en ciberseguridad es posible. Hemos creado una herramienta auditable, que elimina el "vendor lock-in" y pone el poder de un SOC moderno al alcance de cualquier organización con presupuestos limitados.

El código será 100% de código abierto. Si te apasiona la ciberseguridad, la arquitectura de sistemas distribuidos o el desarrollo en Python/React, ¡te invito a estar atento al repositorio y colaborar en las próximas fases del proyecto!

