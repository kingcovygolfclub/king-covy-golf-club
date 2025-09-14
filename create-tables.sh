#!/bin/bash

# Create DynamoDB tables for King Covy Golf Club
set -e

echo "🏗️  Creating DynamoDB tables for King Covy Golf Club..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    print_error "AWS CLI is not configured. Please run 'aws configure' first."
    exit 1
fi

print_status "AWS CLI is configured"

# Function to create a table
create_table() {
    local table_name=$1
    local table_config=$2
    
    print_warning "Creating table: $table_name"
    
    # Check if table already exists
    if aws dynamodb describe-table --table-name $table_name > /dev/null 2>&1; then
        print_warning "Table $table_name already exists, skipping..."
        return 0
    fi
    
    # Create the table
    aws dynamodb create-table --cli-input-json "$table_config"
    
    # Wait for table to be active
    print_warning "Waiting for table $table_name to be active..."
    aws dynamodb wait table-exists --table-name $table_name
    
    print_status "Table $table_name created successfully"
}

# Create products table
PRODUCTS_TABLE_CONFIG='{
  "TableName": "king-covy-products",
  "KeySchema": [
    {
      "AttributeName": "id",
      "KeyType": "HASH"
    }
  ],
  "AttributeDefinitions": [
    {
      "AttributeName": "id",
      "AttributeType": "S"
    },
    {
      "AttributeName": "category",
      "AttributeType": "S"
    },
    {
      "AttributeName": "brand",
      "AttributeType": "S"
    },
    {
      "AttributeName": "featured",
      "AttributeType": "BOOL"
    },
    {
      "AttributeName": "createdAt",
      "AttributeType": "S"
    }
  ],
  "GlobalSecondaryIndexes": [
    {
      "IndexName": "category-index",
      "KeySchema": [
        {
          "AttributeName": "category",
          "KeyType": "HASH"
        },
        {
          "AttributeName": "createdAt",
          "KeyType": "RANGE"
        }
      ],
      "Projection": {
        "ProjectionType": "ALL"
      }
    },
    {
      "IndexName": "brand-index",
      "KeySchema": [
        {
          "AttributeName": "brand",
          "KeyType": "HASH"
        },
        {
          "AttributeName": "createdAt",
          "KeyType": "RANGE"
        }
      ],
      "Projection": {
        "ProjectionType": "ALL"
      }
    },
    {
      "IndexName": "featured-index",
      "KeySchema": [
        {
          "AttributeName": "featured",
          "KeyType": "HASH"
        },
        {
          "AttributeName": "createdAt",
          "KeyType": "RANGE"
        }
      ],
      "Projection": {
        "ProjectionType": "ALL"
      }
    }
  ],
  "BillingMode": "PAY_PER_REQUEST"
}'

create_table "king-covy-products" "$PRODUCTS_TABLE_CONFIG"

# Create inventory table
INVENTORY_TABLE_CONFIG='{
  "TableName": "king-covy-inventory",
  "KeySchema": [
    {
      "AttributeName": "productId",
      "KeyType": "HASH"
    }
  ],
  "AttributeDefinitions": [
    {
      "AttributeName": "productId",
      "AttributeType": "S"
    },
    {
      "AttributeName": "lastUpdated",
      "AttributeType": "S"
    }
  ],
  "GlobalSecondaryIndexes": [
    {
      "IndexName": "last-updated-index",
      "KeySchema": [
        {
          "AttributeName": "lastUpdated",
          "KeyType": "HASH"
        }
      ],
      "Projection": {
        "ProjectionType": "ALL"
      }
    }
  ],
  "BillingMode": "PAY_PER_REQUEST"
}'

create_table "king-covy-inventory" "$INVENTORY_TABLE_CONFIG"

# Create orders table
ORDERS_TABLE_CONFIG='{
  "TableName": "king-covy-orders",
  "KeySchema": [
    {
      "AttributeName": "id",
      "KeyType": "HASH"
    }
  ],
  "AttributeDefinitions": [
    {
      "AttributeName": "id",
      "AttributeType": "S"
    },
    {
      "AttributeName": "customerEmail",
      "AttributeType": "S"
    },
    {
      "AttributeName": "status",
      "AttributeType": "S"
    },
    {
      "AttributeName": "createdAt",
      "AttributeType": "S"
    }
  ],
  "GlobalSecondaryIndexes": [
    {
      "IndexName": "customer-email-index",
      "KeySchema": [
        {
          "AttributeName": "customerEmail",
          "KeyType": "HASH"
        },
        {
          "AttributeName": "createdAt",
          "KeyType": "RANGE"
        }
      ],
      "Projection": {
        "ProjectionType": "ALL"
      }
    },
    {
      "IndexName": "status-index",
      "KeySchema": [
        {
          "AttributeName": "status",
          "KeyType": "HASH"
        },
        {
          "AttributeName": "createdAt",
          "KeyType": "RANGE"
        }
      ],
      "Projection": {
        "ProjectionType": "ALL"
      }
    }
  ],
  "BillingMode": "PAY_PER_REQUEST"
}'

create_table "king-covy-orders" "$ORDERS_TABLE_CONFIG"

# Create customers table
CUSTOMERS_TABLE_CONFIG='{
  "TableName": "king-covy-customers",
  "KeySchema": [
    {
      "AttributeName": "id",
      "KeyType": "HASH"
    }
  ],
  "AttributeDefinitions": [
    {
      "AttributeName": "id",
      "AttributeType": "S"
    },
    {
      "AttributeName": "email",
      "AttributeType": "S"
    }
  ],
  "GlobalSecondaryIndexes": [
    {
      "IndexName": "email-index",
      "KeySchema": [
        {
          "AttributeName": "email",
          "KeyType": "HASH"
        }
      ],
      "Projection": {
        "ProjectionType": "ALL"
      }
    }
  ],
  "BillingMode": "PAY_PER_REQUEST"
}'

create_table "king-covy-customers" "$CUSTOMERS_TABLE_CONFIG"

print_status "All DynamoDB tables created successfully!"

# Display table information
echo ""
echo "📋 Created Tables:"
echo "  • king-covy-products (with GSI: category-index, brand-index, featured-index)"
echo "  • king-covy-inventory (with GSI: last-updated-index)"
echo "  • king-covy-orders (with GSI: customer-email-index, status-index)"
echo "  • king-covy-customers (with GSI: email-index)"
echo ""
echo "🔗 Next steps:"
echo "  1. Set up API Gateway to expose Lambda functions"
echo "  2. Seed the products table with sample data"
echo "  3. Test the complete API endpoints"
echo ""
