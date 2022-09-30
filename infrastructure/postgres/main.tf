terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "ap-northeast-2"
}


resource "aws_instance" "app_server" {
  ami           = "ami-0e9bfdb247cc8de84"
  instance_type = "t2.micro"
  key_name      = "veltrends"
  user_data     = file("scripts/init_postgresql.sh")
  tags = {
    Name = "Veltrends PostgreSQL"
  }
}

output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.app_server.id
}

output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.app_server.public_ip
}

output "instance_private_ip" {
  description = "Private IP address of the EC2 instance"
  value       = aws_instance.app_server.private_ip
}



