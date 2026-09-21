# EcoMuni

## Descripción

EcoMuni es una plataforma web orientada a la gestión y seguimiento de reportes ambientales en los 22 departamentos de Guatemala.
El sistema permite a los ciudadanos reportar problemáticas ambientales, dar seguimiento a los casos, aportar evidencias fotográficas y participar mediante comentarios y apoyos a los reportes existentes.
La plataforma busca fortalecer la comunicación entre la ciudadanía y las municipalidades para facilitar la identificación y atención de problemas relacionados con el medio ambiente.

---

## Características principales

* Registro e inicio de sesión de usuarios.
* Gestión de roles dentro del sistema.
* Creación y consulta de reportes ambientales.
* Clasificación de reportes por categorías.
* Asignación de prioridades a los reportes.
* Seguimiento del estado de los reportes.
* Comentarios en reportes.
* Apoyo ciudadano a reportes.
* Adjuntar evidencias fotográficas.
* Gestión de información por departamento.
* Consulta de puntos de reciclaje.

---

## Tecnologías utilizadas

### Frontend

* Angular 22.1.6
* TypeScript

### Backend

* Node.js 22.22.3
* Express
* TypeScript
* CORS

### Base de datos

* PostgreSQL

---

## Estructura del proyecto

```text
EcoMuni/
│
├── Backend/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── Frontend/
│   ├── src/
│   ├── package.json
│   └── ...
│
└── README.md
```

---

## Requisitos previos

Antes de ejecutar el proyecto es necesario tener instalado:

* Node.js 22.22.3 o superior
* PostgreSQL
* PNPM
* Angular CLI

Verificar las instalaciones:

```bash
node -v
pnpm -v
ng version
```

---

## Configuración de la base de datos

Crear una base de datos PostgreSQL y configurar las credenciales correspondientes dentro del archivo:

```env
.env
```

Ejemplo:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecomuni
DB_USER=postgres
DB_PASSWORD=tu_contraseña
```

---

## Instalación

### Backend

Ingresar a la carpeta Backend:

```bash
cd Backend
```

Instalar dependencias:

```bash
pnpm install
```

### Frontend

Ingresar a la carpeta Frontend:

```bash
cd Frontend
```

Instalar dependencias:

```bash
pnpm install
```

---

## Ejecución del proyecto

### Iniciar Backend

Desde la carpeta Backend:

```bash
pnpm dev
```

o

```bash
pnpm run dev
```

### Iniciar Frontend

Desde la carpeta Frontend:

```bash
ng serve
```

o

```bash
pnpm start
```

---
