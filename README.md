# Frontend Admin

This application is part of full stack application, you can find the backend service on my github with 'backend-admin' repository. Basically this application is for login, signup, send verification code, and CRUD transactions

## Prerequisite

Make sure you have this on your operating system:

- Node.js v18.17
- Docker

## Installation

1. Clone this repository:
    ```bash
    git clone https://github.com/FauzanAr/frontend-admin.git
    cd frontend-admin
    ```

2. Install dependency (Optional):
    ```bash
    npm install
    # atau
    yarn install
    ```
3. Make sure the backend-admin already running (Required)

## Run the application

You can run this application by typing this command inside the project:

```bash
docker build . -t "frontend-admin:v1.0"
docker run -p 8080:8080 frontend-admin:v1.0
