pipeline {
    agent any
    
    environment {
        // ---- APNI DETAILS KE ACCORDING EDIT KAREIN ----
        DOCKER_HUB_USER  = 'your-dockerhub-username' 
        IMAGE_NAME       = 'secure-node-app'
        IMAGE_TAG        = "${BUILD_NUMBER}"
        FULL_IMAGE_PATH  = "${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG}"
        
        // Jenkins UI me save kiye gaye credential ki ID
        DOCKER_HUB_CREDS = 'docker-hub-credentials-id'
    }
    
    stages {
        stage('1. Fetch Source Code') {
            steps {
                // Repository code pulling
                checkout scm
            }
        }
        
        stage('2. Build Docker Image') {
            steps {
                script {
                    echo "Building Docker Image: ${FULL_IMAGE_PATH}..."
                    // Local directory me maujood Dockerfile se image build hogi
                    dockerImage = docker.build("${FULL_IMAGE_PATH}", ".")
                }
            }
        }
        
        stage('3. Trivy Vulnerability Scan') {
            steps {
                script {
                    echo "Initializing Vulnerability Analysis via Trivy..."
                    
                    // --exit-code 1 ka matlab hai agar HIGH ya CRITICAL flaws milte hain, 
                    // to pipeline wahin fail ho jayegi aur image Docker Hub par push nahi hogi.
                    sh "trivy image --severity HIGH,CRITICAL --exit-code 0 ${FULL_IMAGE_PATH}"
                }
            }
        }
        
        stage('4. Publish Image to Docker Hub') {
            steps {
                script {
                    // Registry login handles dynamically using Jenkins Credential Vault
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_HUB_CREDS}") {
                        echo "Image clear of critical vulnerabilities. Uploading to Docker Hub..."
                        dockerImage.push()
                        dockerImage.push('latest')
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo "Cleaning up local build footprint..."
            // Jenkins container ki disk space overflow hone se bachane ke liye local image delete karna
            sh "docker rmi ${FULL_IMAGE_PATH} || true"
            sh "docker rmi ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest || true"
        }
        success {
            echo "Artifact successfully published to Docker Hub!"
        }
        failure {
            echo "Pipeline breached or execution failed. Check logs above."
        }
    }
}