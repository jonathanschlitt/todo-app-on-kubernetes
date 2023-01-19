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

## Deploy Traefik to Kubernetes

### Create Traefik Namespace and add secrets file

```bash
kubectl create ns traefik

kubectl apply -f cloudflare-credentials.yaml -ns treafik # For Cloudlare DNS

kubectl apply -f openstack-credentials.yaml -ns treafik # For Openstack Designate DNS
```

### Now we can deploy the helm Chart for Traefik

```bash
helm repo add traefik https://traefik.github.io/charts

helm install traefik traefik/traefik --values=traefik-values.yaml -n traefik # For Cloudflare

helm install traefik traefik/traefik --values=traefik-values_openstack.yaml -n traefik # For Openstack

```

## Deploy todo-app to kubernetes

### Install todo-app chart using LoadBalancers (Version from Older Commits)

```bash
helm install todo-app ./todo-app -n todo-app --create-namespace
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

### Install todo-app chart using traefik Ingress Controller

```bash
helm install todo-app ./todo-app -n todo-app --create-namespace --values="values.yaml" # For Cloudflare and Digital Ocean

helm install todo-app ./todo-app -n todo-app --create-namespace --values="k8s3-values.yaml" # For Openstack

```

### Uninstall todo-chart chart

```bash

helm uninstall todo-app
```

### Install ArgoCD

```
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'

kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

### Delete ArgoCD

```
kubectl delete all --all -n argocd

kubectl delete ns argocd
```
