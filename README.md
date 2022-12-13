# todo-app-on-kubernetes

## Run Stack for development

First you need to rename the sample.env files (frontend + backend) to .env and fill in the values.

**Start Frontend:**
```bash
cd frontend 
npm install
npm run start
```

**Start Backend:**
```bash
cd backend
npm install
npm run start
```

First you need to clone this repository to your local machine. After that, access to the cluster via kubectl is requiered to install the chart.

## Deploy Stack to kubernetes

### Install helm chart

```bash
helm install todo-app ./helm -n todo-app --create-namespace
```

The service types of frontend and backend are LoadBalancer which means that the services can be accessed over public or floating IPs.

To access the backend service, we need to add the LoadBalancer address to the BackendUrl of the frontend service.

```bash
kubectl edit deployment.apps/todo-frontend-app-deploy -n todo-app
...
 spec:
      containers:
      - env:
        - name: REACT_APP_BACKEND_URL
          value: http://164.90.242.158 <== here!
...          
```

### Uninstall helm chart
```bash

helm uninstall todo-app
```