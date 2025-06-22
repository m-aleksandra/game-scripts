local lapis = require("lapis")
local respond_to = require("lapis.application").respond_to
local app = lapis.Application()

local json = require("cjson")

local categories = {}
local products = {}

local next_category_id = 1
local next_product_id = 1

local function find_by_id(list, id)
  for _, item in ipairs(list) do
    if item.id == id then return item end
  end
end

-- Categories
app:match("/categories", respond_to({
  GET = function()
    return { json = categories }
  end,

  POST = function(self)
    local body = self.params
    local category = {
      id = next_category_id,
      name = body.name or "Unnamed"
    }
    next_category_id = next_category_id + 1
    table.insert(categories, category)
    return { status = 201, json = category }
  end
}))

app:match("/categories/:id", respond_to({
  GET = function(self)
    local id = tonumber(self.params.id)
    local category = find_by_id(categories, id)
    if not category then
      return { status = 404, json = { error = "Category not found" } }
    end
    return { json = category }
  end,

  PUT = function(self)
    local id = tonumber(self.params.id)
    local category = find_by_id(categories, id)
    if not category then
      return { status = 404, json = { error = "Category not found" } }
    end
    category.name = self.params.name or category.name
    return { json = category }
  end,

  DELETE = function(self)
    local id = tonumber(self.params.id)
    for i, category in ipairs(categories) do
      if category.id == id then
        table.remove(categories, i)
        return { status = 204 }
      end
    end
    return { status = 404, json = { error = "Category not found" } }
  end
}))

app:match("/products", respond_to({
  GET = function()
    return { json = products }
  end,

  POST = function(self)
    local body = self.params
    local product = {
      id = next_product_id,
      name = body.name or "Unnamed",
      price = tonumber(body.price) or 0,
      category_id = tonumber(body.category_id)
    }
    next_product_id = next_product_id + 1
    table.insert(products, product)
    return { status = 201, json = product }
  end
}))

app:match("/products/:id", respond_to({
  GET = function(self)
    local id = tonumber(self.params.id)
    local product = find_by_id(products, id)
    if not product then
      return { status = 404, json = { error = "Product not found" } }
    end
    return { json = product }
  end,

  PUT = function(self)
    local id = tonumber(self.params.id)
    local product = find_by_id(products, id)
    if not product then
      return { status = 404, json = { error = "Product not found" } }
    end
    product.name = self.params.name or product.name
    product.price = tonumber(self.params.price) or product.price
    product.category_id = tonumber(self.params.category_id) or product.category_id
    return { json = product }
  end,

  DELETE = function(self)
    local id = tonumber(self.params.id)
    for i, product in ipairs(products) do
      if product.id == id then
        table.remove(products, i)
        return { status = 204 }
      end
    end
    return { status = 404, json = { error = "Product not found" } }
  end
}))

return app
