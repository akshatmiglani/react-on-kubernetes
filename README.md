# react-on-kubernetes

This project focuses on deploying a React-based whiteboard application to Amazon Elastic Kubernetes Service (EKS). The goal is to create a scalable and reliable deployment using Kubernetes orchestration managed on AWS infrastructure. The aim is to successfully configure load balancing, ingress and security mechanisms.

## Project Objectives

1. Develop a React Application: Set up a simple whiteboard/drawing app as the application to be deployed.

2. Containerize the application: Package the React app into a Docker container for deployment.

3. Set up EKS Cluster: Create and configure EKS cluster using the AWS CLI and later interacting it with kubectl.

4. New fargate Profile : Configure Fargate to run worker nodes in a serverless environment.

5. Deploying Kubernetes Objects : Set up Deployment, Service, and Ingress configurations for your React app.

6. Ingress Controller Configuration: Configuring the ingress controller to manage traffic and act as a load balancer.

7. Configuring OIDC and Authentication: Integrate OpenID Connect for AWS IAM (Identity Access Management).

8. Deploy ALB Controller: Use the Application Load Balancer Controller to route external traffic to the application.


## Introduction of Concepts:

EKS is a managed Kubernetes service by AWS. It simplifies running Kubernetes clusters on AWS infrastructure. Kubernetes automates container orchestration tasks such as deployment, scaling, and managing workloads.

Fargate: A serverless compute engine that allows you to run containers without managing EC2 instances.


kubectl: A command-line tool used to interact with Kubernetes clusters.


Deployment: Manages the creation and scaling of your application's pods.


Service: Exposes the application running on pods to external traffic or other services.


Ingress: Manages HTTP and HTTPS routing to services.

Ingress Controller routes external traffic to Kubernetes services. The AWS Load Balancer Controller integrates with ALB (Application Load Balancer) to handle HTTP/HTTPS requests.

OIDC is an authentication protocol for securely verifying user identities. AWS uses OIDC to provide secure access to EKS and other AWS services.


```bash
aws configure
```

```bash
eksctl create cluster –-name drawing-app-cluster --region ap-south-1 --fargate
```

```bash
aws eks update-kubeconfig --name drawing-app-cluster --region ap-south-1     
```

```bash
eksctl create fargateprofile --cluster drawing-app-cluster --region ap-south-1 --name demo-fargate --namespace app-whiteboard
```

```bash
kubectl apply -f deployment.yaml
```

```bash
kubectl get pods -n app-whiteboard
```

```bash
kubectl get svc -n app-whiteboard #(it has cluster-ip, no external-ip)
```

```bash
kubectl get ingress -n app-whiteboard #(class – alb, hosts *, address ?? , port)
```

```bash
eksctl utils associate-iam-oidc-provider --cluster drawing-app-cluster --approve
```

```bash
curl -O https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.5.4/docs/install/iam_policy.json
```

```bash
aws iam create-policy --policy-name AWSLoadBalancerControllerIAMPolicy --policy-document file://iam_policy.json
```

```bash
eksctl create iamserviceaccount --cluster=drawing-app-cluster --namespace=kube-system --name=aws-load-balancer-controller --role-name AmazonEKSLoadBalancerControllerRole --attach-policy-arn=arn:aws:iam::668371971994:policy/AWSLoadBalancerControllerIAMPolicy --approve
```

```bash
helm repo add eks https://aws.github.io/eks-charts
```

```bash
helm repo update eks
```

```bash
helm install aws-load-balancer-controller eks/aws-load-balancer-controller  -n kube-system --set clusterName=drawing-app-cluster --set serviceAccount.create=false --set serviceAccount.name=aws-load-balancer-controller --set region=ap-south-1 --set vpcId=<your:vpc:id>
```

```bash
kubectl get deployment -n kube-system 
```

```bash
kubectl get pods -n kube-system
```

```bash
kubectl get ingress -n app-whiteboard
```

## Links for Tools

Helm: https://github.com/helm/helm/releases

Kubectl: https://kubernetes.io/docs/reference/kubectl/

AWS CLI: https://aws.amazon.com/cli/

EKSCTL: https://eksctl.io/installation/
