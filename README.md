# Web Semana 0 - Santo Tomas

## Descripcion

Este proyecto es una aplicacion web desarrollada en React para la "Semana 0" de la institucion Santo Tomas. Su objetivo principal es servir como un portal centralizado que dirige a los estudiantes y usuarios a diversos hipervinculos de importancia, facilitando el acceso a recursos e informacion clave.

## Tecnologias Utilizadas

- React
- HTML, CSS y JavaScript

## Funcionalidades Principales

- Interfaz de navegacion rapida e intuitiva.
- Directorio de hipervinculos relevantes para la orientacion institucional.
- Diseno adaptable y responsivo para asegurar una correcta visualizacion tanto en dispositivos moviles como de escritorio.

## Instalacion y Uso

Para ejecutar este proyecto de forma local, sigue estos pasos:

1. Abre una terminal en el directorio del proyecto.
2. Ejecuta el comando `npm install` para instalar todas las dependencias necesarias.
3. Ejecuta el comando `npm run dev` (o `npm start`, dependiendo de tu configuracion) para iniciar el servidor de desarrollo.
4. Abre tu navegador y accede a la direccion local indicada en la terminal.

## Administracion de usuarios (Firebase)

Se implemento administracion de usuarios para Inventario con Firebase Authentication + Cloud Functions:

- El admin puede crear y eliminar usuarios desde la interfaz de Inventario.
- Los usuarios creados pueden acceder al sistema, pero no pueden crear ni eliminar usuarios.
- La autorizacion admin se valida en backend mediante custom claim `role=admin` o por correo admin configurado.

### Variables recomendadas

En `client/.env`:

- `VITE_INVENTARIO_ADMIN_EMAIL=admin@ust.cl`
- `VITE_FIREBASE_API_KEY=...`
- `VITE_FIREBASE_AUTH_DOMAIN=...`
- `VITE_FIREBASE_PROJECT_ID=...`
- `VITE_FIREBASE_STORAGE_BUCKET=...`
- `VITE_FIREBASE_MESSAGING_SENDER_ID=...`
- `VITE_FIREBASE_APP_ID=...`

En Firebase Functions config:

- `INVENTARIO_ADMIN_EMAIL=admin@ust.cl`

### Despliegue de Functions

1. Instalar Firebase CLI e iniciar sesion: `firebase login`
2. Seleccionar proyecto: `firebase use <project-id>`
3. Desplegar funciones: `firebase deploy --only functions`
