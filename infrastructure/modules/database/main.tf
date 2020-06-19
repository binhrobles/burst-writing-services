/* uses user as partition, prompt_createtime as sort */
/* should allow quick queries for user entries */
/* at scale, with inconsistent user usage, this would hot spot */
/* maintains key uniqueness via user-prompt-creationtime relationship */
/* allows easy retrieval of previous entries of this prompt (useful?) */
resource "aws_dynamodb_table" "entries_table" {
  name = "Entries"

  /* taking advantage of provisioned free-tier */
  billing_mode   = "PROVISIONED"
  read_capacity  = 2
  write_capacity = 2

  hash_key  = "User"
  range_key = "Prompt_CreateTime"

  attribute {
    name = "User"
    type = "S"
  }

  attribute {
    name = "Prompt_CreateTime"
    type = "S"
  }
}
