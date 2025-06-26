import requests
import json
from pydantic import BaseModel, Field
from typing import List, Optional

# Re-defining the schemas here for simplicity, but in a larger project,
# you might share them between client and server.

class Product(BaseModel):
    date: int
    store_id: int
    code: str
    article_number: str
    name: str
    aisle: str
    brand: str
    package_size: str
    price: float
    unit: str
    sale_type: str
    product_link: Optional[str] = None

class Recipe(BaseModel):
    title: str
    ingredients: List[str]
    instructions: str

class NutritionalInfo(BaseModel):
    calories: Optional[float] = None
    fat: Optional[float] = None
    protein: Optional[float] = None
    carbohydrates: Optional[float] = None

class SearchResponse(BaseModel):
    products: Optional[List[Product]] = None
    recipe: Optional[Recipe] = None
    similar_products: Optional[List[Product]] = None
    nutritional_info: Optional[NutritionalInfo] = None
    summary: str

class MCPResponse(BaseModel):
    data: SearchResponse

def run_query(query: str):
    """Sends a query to the MCP server and prints the response."""
    url = "http://localhost:8000/mcp"
    
    # Construct the curl command
    data = {"query": query}
    curl_command = f"curl -X POST {url} -H 'Content-Type: application/json' -d '{json.dumps(data)}'"
    
    print("\n--- Equivalent cURL Command ---")
    print(curl_command)
    
    try:
        response = requests.post(url, json=data)
        response.raise_for_status()  # Raise an exception for bad status codes
        
        mcp_response = MCPResponse(**response.json())
        
        print(f"\n--- Query: {query} ---")
        print(f"Summary: {mcp_response.data.summary}")
        
        if mcp_response.data.products:
            print("Products found:")
            for product in mcp_response.data.products:
                print(f"  - {product.name} (${product.price}) - Link: {product.product_link}")
                
        if mcp_response.data.similar_products:
            print("Similar products found:")
            for product in mcp_response.data.similar_products:
                print(f"  - {product.name} (${product.price}) - Link: {product.product_link}")

        if mcp_response.data.recipe:
            print("Recipe:")
            print(f"  Title: {mcp_response.data.recipe.title}")
            print("  Ingredients:")
            for ingredient in mcp_response.data.recipe.ingredients:
                print(f"    - {ingredient}")
            print("  Instructions:")
            print(mcp_response.data.recipe.instructions)
            
        if mcp_response.data.nutritional_info:
            print("Nutritional Information:")
            print(f"  - Calories: {mcp_response.data.nutritional_info.calories}")
            print(f"  - Fat: {mcp_response.data.nutritional_info.fat}g")
            print(f"  - Protein: {mcp_response.data.nutritional_info.protein}g")
            print(f"  - Carbohydrates: {mcp_response.data.nutritional_info.carbohydrates}g")

    except requests.exceptions.RequestException as e:
        print(f"Error connecting to the server: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")

def display_menu():
    """Displays the main menu."""
    print("\n--- No Name MCP Client ---")
    print("1. Run a specific query")
    print("2. Run all queries sequentially")
    print("3. Exit")

def main():
    """Main function to run the MCP client."""
    
    queries = [
        {
            "description": "Search for a product",
            "query_template": "Find products matching '{}'",
            "requires_parameter": True,
        },
        {
            "description": "Find similar products",
            "query_template": "Find products similar to '{}'",
            "requires_parameter": True,
        },
        {
            "description": "Search for a product with a link",
            "query_template": "Find products matching '{}' and include a link",
            "requires_parameter": True,
        },
        {
            "description": "Find similar products with a link",
            "query_template": "Find products similar to '{}' and include a link",
            "requires_parameter": True,
        },
        {
            "description": "Generate a recipe",
            "query_template": "Create a recipe with '{}' and '{}'",
            "requires_parameter": True,
        },
        {
            "description": "Get nutritional information",
            "query_template": "What are the nutritional facts for '{}'",
            "requires_parameter": True,
        },
        {
            "description": "Run all tools (no parameters)",
            "query_template": "Find products matching 'milk', find similar products to 'whole wheat bread', create a recipe with 'eggs' and 'cheese', and get nutritional facts for 'avocado'",
            "requires_parameter": False,
        }
    ]

    while True:
        display_menu()
        choice = input("Enter your choice (1-3): ")

        if choice == "1":
            print("\n--- Select a Query ---")
            for i, query in enumerate(queries):
                print(f"{i + 1}. {query['description']}")
            
            try:
                query_choice = int(input(f"Enter your choice (1-{len(queries)}): ")) - 1
                if 0 <= query_choice < len(queries):
                    selected_query = queries[query_choice]
                    query_template = selected_query["query_template"]
                    
                    if selected_query["requires_parameter"]:
                        params = []
                        # Crude way to get parameters, assuming they are all strings
                        for _ in range(query_template.count('{}')):
                            param = input(f"Enter parameter: ")
                            params.append(param)
                        final_query = query_template.format(*params)
                    else:
                        final_query = query_template

                    print(f"\nRunning query: {final_query}")
                    if input("Proceed? (y/n): ").lower() == 'y':
                        run_query(final_query)
                else:
                    print("Invalid choice.")
            except ValueError:
                print("Invalid input. Please enter a number.")

        elif choice == "2":
            print("\n--- Running All Queries ---")
            for query in queries:
                if not query["requires_parameter"]:
                    print(f"\nRunning query: {query['query_template']}")
                    run_query(query['query_template'])
            
        elif choice == "3":
            print("Exiting.")
            break
        else:
            print("Invalid choice. Please enter a number between 1 and 3.")

if __name__ == "__main__":
    main()