# Create a VPC
resource "aws_vpc" "todo_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "TodoVPC"
  }
}

# Create an internet gateway for the VPC
resource "aws_internet_gateway" "todo_igw" {
  vpc_id = aws_vpc.todo_vpc.id

  tags = {
    Name = "TodoInternetGateway"
  }
}

# Create a public route table for the VPC
resource "aws_route_table" "todo_public_rt" {
  vpc_id = aws_vpc.todo_vpc.id

  tags = {
    Name = "TodoPublicRouteTable"
  }
}

# Add a default route to the internet gateway in the public route table
resource "aws_route" "todo_public_route" {
  route_table_id         = aws_route_table.todo_public_rt.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.todo_igw.id
}

# Fetch available availability zones
data "aws_availability_zones" "available" {
  state = "available"
}

# Create subnets in two different availability zones
resource "aws_subnet" "todo_subnet_a" {
  vpc_id                  = aws_vpc.todo_vpc.id
  cidr_block              = "10.0.10.0/24" # Updated CIDR block to avoid conflict
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "TodoSubnetA"
  }
}

resource "aws_subnet" "todo_subnet_b" {
  vpc_id                  = aws_vpc.todo_vpc.id
  cidr_block              = "10.0.20.0/24" # Updated CIDR block to avoid conflict
  availability_zone       = "us-east-1b"
  map_public_ip_on_launch = true

  tags = {
    Name = "TodoSubnetB"
  }
}

# Create an RDS subnet group with subnets in two AZs
resource "aws_db_subnet_group" "todo_db_subnet_group" {
  name       = "todo-db-subnet-group"
  subnet_ids = [aws_subnet.todo_subnet_a.id, aws_subnet.todo_subnet_b.id]

  tags = {
    Name = "TodoDBSubnetGroup"
  }
}

# Associate the subnets with the public route table
resource "aws_route_table_association" "todo_public_subnet_association_a" {
  subnet_id      = aws_subnet.todo_subnet_a.id
  route_table_id = aws_route_table.todo_public_rt.id
}

resource "aws_route_table_association" "todo_public_subnet_association_b" {
  subnet_id      = aws_subnet.todo_subnet_b.id
  route_table_id = aws_route_table.todo_public_rt.id
}
