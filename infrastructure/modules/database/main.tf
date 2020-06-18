/* use prompt-user as partition, createtime as sort */
/* TODO: how could one search for all user's entries? GSI? switch hash key around? */
resource "aws_dynamodb_table" "entries_table" {
  name = "Entries"

  /* taking advantage of provisioned free-tier */
  billing_mode   = "PROVISIONED"
  read_capacity  = 2
  write_capacity = 2

  hash_key  = "Prompt_User"
  range_key = "CreateTime"

  attribute {
    name = "Prompt_User"
    type = "S"
  }

  attribute {
    name = "CreateTime"
    type = "S"
  }
}
