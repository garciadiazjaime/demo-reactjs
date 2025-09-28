variable "mysql_database" {
  description = "The name of the MySQL database to create"
  type        = string
}

variable "mysql_user" {
  description = "The MySQL database username"
  type        = string
}

variable "mysql_pwd" {
  description = "The MySQL database password"
  type        = string
}

variable "region" {
  description = "The AWS region to deploy resources in"
  type        = string
  default     = "us-east-1" # Explicitly set to us-east-1
}

variable "azs" {
  description = "List of availability zones to use"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"] # Default AZs for us-east-1
}
