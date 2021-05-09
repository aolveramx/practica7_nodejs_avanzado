#WallaFake

> práctica #7 NodeJS Avanzado

#### Introducción

WallaFake es una aplicación Web donde puedes publicar anuncios de venta y compra de segunda mano.

Para utilizar el API puedes visitar el enlace en la barra de navegación de Documentación API.

#### Requisitos

Antes de comenzar es necesario que tengas encuenta los siguientes requisitos:

1. Crear una cuenta en [mongoDB](https://account.mongodb.com/account/login?n=%2Fv2%2F601c769671f21b1b4041a8a3&nextHash=%23clusters) para crear un _Cluster_ gratuito.
2. Crear una cuenta en [mailtrap](https://mailtrap.io/).

#### Comenzar a usar

Una vez cumplidos los requisitos anterires realiza un **git clone** del repositorio.

Instala las dependencias

```sh
npm i
```

Renombra el archivo _config.example.env_ como **config.env**

#### Configuración Básica

- Insertar tu URI de del _Cluster_ que has creado en mongoDB.
- Es recomendable que agregues una clave a la variable JWT_Secret.
- Ingresa tus credenciales de mailtrap.io para realizar el envío del token por si "olvidaste tu contraseña".

#### Configuración Avanzada

En el archivo **config.env** puedes modificar todas las variables de entorno para personalizar la aplicación.

#### Carga de base de datos

La aplicación cuenta con un archivo **seeder.js** el cual es ejecutable con el siguiente comando:

```sh
node seeder.js -i
```

Para importar la base de datos pre-cargada para comenzar a usar la aplicación.

También puedes ejecutar el sigueinte comando para vaciar la base de datos en cualquier comento:

```sh
node seeder.js -i
```

#### Comienza a usar WallaFake

```sh
npm run dev
```

#### Modo Cluster

Puedes correr el siguiente comando para arrancar mas instancias de WallaFake API, según el número de CPU cores que tenga tu equipo.

```sh
npm run cluster
```

#### Microservicio imagen miniatura (thumbnail)

La aplicación cuenta con un microservicio para convertir las imagenes de los anuncios en imagenes miniatura (thumbnails) de 100x100 px, con el siguiente comando:

```sh
npm run thumbnail
```
