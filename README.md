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

### Install ArgoCD CLI

```
brew install brew install argocd

or 

$version = (Invoke-RestMethod https://api.github.com/repos/argoproj/argo-cd/releases/latest).tag_name

$url = "https://github.com/argoproj/argo-cd/releases/download/" + $version + "/argocd-windows-amd64.exe"
$output = "argocd.exe"

Invoke-WebRequest -Uri $url -OutFile $output


```

### Add Argocd Image Updater


```
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj-labs/argocd-image-updater/stable/manifests/install.yaml
```

#### Configure Accounts through the CLI

```
argocd login <ip> --username admin --grpc-web-root-path /

argocd account list

k edit configmap argocd-cm -n argocd

# add this line accounts.image-updater: apiKey

argocd account list

argocd account generate-token --account image-updater --id image-updater

# eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhcmdvY2QiLCJzdWIiOiJpbWFnZS11cGRhdGVyOmFwaUtleSIsIm5iZiI6MTY3NTkzODgxNywiaWF0IjoxNjc1OTM4ODE3LCJqdGkiOiJpbWFnZS11cGRhdGVyIn0.65Nq0N4HQxut1reE-D_RTxT79OYt-lOEUA9zEHXsjAo

#base64
ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKaGNtZHZZMlFpTENKemRXSWlPaUpwYldGblpTMTFjR1JoZEdWeU9tRndhVXRsZVNJc0ltNWlaaUk2TVRZM05Ua3pPRGd4Tnl3aWFXRjBJam94TmpjMU9UTTRPREUzTENKcWRHa2lPaUpwYldGblpTMTFjR1JoZEdWeUluMC42NU5xME40SFF4dXQxcmVFLURfUlR4VDc5T1l0LWxPRVVBOXpFSFhzakFvCg==
```

#### Set RBAC for the new user 
data:
  policy.csv: |
    p, role:image-updater, applications, get, */*, allow
    p, role:image-updater, applications, update, */*, allow
    g, image-updater, role:image-updater

```
k edit configmap argocd-rbac-cm -n argocd
```

#### Restart Image Updater to apply the changes to the ConfigMap
```
kubectl -n argocd rollout restart deployment argocd-image-updater
```

kubectl create secret generic argocd-image-updater-secret \
  --from-literal argocd.token=ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKaGNtZHZZMlFpTENKemRXSWlPaUpwYldGblpTMTFjR1JoZEdWeU9tRndhVXRsZVNJc0ltNWlaaUk2TVRZM05Ua3pPRGd4Tnl3aWFXRjBJam94TmpjMU9UTTRPREUzTENKcWRHa2lPaUpwYldGblpTMTFjR1JoZEdWeUluMC42NU5xME40SFF4dXQxcmVFLURfUlR4VDc5T1l0LWxPRVVBOXpFSFhzakFvCg== --dry-run=client -o yaml | kubectl -n argocd apply -f -


kubectl -n argocd rollout restart deployment argocd-image-updater