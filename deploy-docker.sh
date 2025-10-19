#!/bin/bash

# Traffic CRM - Docker Deployment Script
# This script builds and runs the application in Docker

set -e

echo "🐳 Traffic CRM - Docker Deployment"
echo "=================================="
echo ""

# Configuration
IMAGE_NAME="traffic-crm-frontend"
CONTAINER_NAME="traffic-crm-app"
PORT=8080

# Build Docker image
echo "🔨 Building Docker image..."
docker build -t $IMAGE_NAME .

# Stop and remove existing container if it exists
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    echo "🛑 Stopping existing container..."
    docker stop $CONTAINER_NAME
    docker rm $CONTAINER_NAME
fi

# Run the container
echo "🚀 Starting container..."
docker run -d \
    --name $CONTAINER_NAME \
    -p $PORT:80 \
    --restart unless-stopped \
    $IMAGE_NAME

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🎉 Your application is now running!"
echo ""
echo "Access your application at: http://localhost:$PORT"
echo ""
echo "Useful commands:"
echo "  docker logs $CONTAINER_NAME        # View logs"
echo "  docker stop $CONTAINER_NAME        # Stop container"
echo "  docker start $CONTAINER_NAME       # Start container"
echo "  docker restart $CONTAINER_NAME     # Restart container"
echo ""

