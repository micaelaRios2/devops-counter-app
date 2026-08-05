# 🚀 DevOps Counter & Runner App

![Docker CI 
Pipeline](https://github.com/micaelaRios2/devops-counter-app/actions/workflows/docker-ci.yml/badge.svg)
![Docker](https://img.shields.io/badge/Docker-24.0+-2496ED?logo=docker&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7.0+-DC382D?logo=redis&logoColor=white)

Una aplicación web interactiva desarrollada con **Node.js** y **Redis**, 
orquestada mediante **Docker Compose** e integrada con un pipeline 
automático de **CI/CD con GitHub Actions**.

---

## 🎮 Características
- **Contador de Visitas en Tiempo Real:** Registra la cantidad de 
ejecuciones persistiendo los datos en una base de datos Redis.
- **Mini Juego Integrado:** Incluye un juego *Docker Runner* en 
HTML5/Canvas dentro de la misma interfaz web.
- **Entorno Contenerizado:** Aislamiento total de servicios usando Docker 
Compose y redes privadas de Docker.
- **Integración Continua (CI):** Automatización de pruebas y build de 
imágenes en la nube con GitHub Actions en cada Pull Request o Commit a 
`main`.

---

## 🏗️ Arquitectura del Sistema

```text
       [ Cliente / Navegador ]
                  │
                  ▼ (Puerto 3000)
    ┌───────────────────────────┐
    │   Contenedor Node.js      │
    │  (App Web + Runner Game)  │
    └─────────────┬─────────────┘
                  │ (Red Docker Interna)
                  ▼ (Puerto 6379)
    ┌───────────────────────────┐
    │     Contenedor Redis      │
    │   (Persistencia Datos)    │
    └───────────────────────────┘

