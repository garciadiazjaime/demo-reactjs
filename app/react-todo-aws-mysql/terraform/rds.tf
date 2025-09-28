provider "aws" {
  profile = "todo-profile"
  region = var.region # Use the region variable
}

resource "aws_db_instance" "todo_db" {
  identifier              = "todo-database"
  engine                  = "mysql"
  engine_version          = "8.0.37"      # Use a supported MySQL version
  instance_class          = "db.t3.micro" # Free-tier eligible instance class
  allocated_storage       = 20            # Minimum storage for free-tier eligibility
  db_name                 = var.mysql_database   # Pull from environment variable
  username                = var.mysql_user # Pull from environment variable
  password                = var.mysql_pwd 
  publicly_accessible     = true # Enable public access for direct connection
  skip_final_snapshot     = true
  deletion_protection     = false
  backup_retention_period = 0 # Disable backups to avoid additional costs
  parameter_group_name    = "default.mysql8.0"
  db_subnet_group_name    = aws_db_subnet_group.todo_db_subnet_group.name

  # Associate the security group
  vpc_security_group_ids = [aws_security_group.db_access.id]

  tags = {
    Name = "TodoDatabase"
  }
}

resource "aws_security_group" "db_access" {
  name_prefix = "todo-db-access"
  vpc_id      = aws_vpc.todo_vpc.id # Specify the VPC ID

  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "TodoDBAccess"
  }
}

resource "null_resource" "init_db" {
  depends_on = [aws_db_instance.todo_db]

  provisioner "local-exec" {
    environment = {
      MYSQL_HOST     = replace(aws_db_instance.todo_db.endpoint, ":3306", "")
      MYSQL_USER     = var.mysql_user
      MYSQL_PWD      = var.mysql_pwd
      MYSQL_DATABASE = aws_db_instance.todo_db.db_name # Dynamically pull the database name
    }
    command = <<EOT
      echo "host: $MYSQL_HOST"
      echo "Waiting for database to be ready..."

      mysql -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PWD -e "
      USE $MYSQL_DATABASE;
      CREATE TABLE IF NOT EXISTS todos (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        text VARCHAR(255) NOT NULL,
        done BOOLEAN NOT NULL DEFAULT false,
        list VARCHAR(50) NOT NULL DEFAULT 'default',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );"
    EOT
  }
}
