require 'nokogiri'
require 'open-uri'

puts "🔗 Enter an Amazon search URL (e.g., https://www.amazon.com/s?k=laptop):"
url = gets.chomp.strip

begin
  headers = {
    "User-Agent" => "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "\
                    "(KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    "Accept-Language" => "en-US,en;q=0.9"
  }

  html = URI.open(url, headers)
  doc = Nokogiri::HTML(html)
rescue OpenURI::HTTPError => e
  puts "❌ HTTP Error: #{e.message}"
  exit
rescue SocketError => e
  puts "❌ Network error: #{e.message}"
  exit
end

puts "\n📦 Found products:\n\n"

products = doc.css('div.s-result-item[data-component-type="s-search-result"]')

if products.empty?
  puts "⚠️ No products found."
  exit
end

products.each_with_index do |product, index|
  title = product.at_css('h2 span')&.text&.strip
  price_whole = product.at_css('span.a-price-whole')&.text&.strip
  price_fraction = product.at_css('span.a-price-fraction')&.text&.strip
  price = price_whole && price_fraction ? "#{price_whole}.#{price_fraction}" : "Not available"

  next unless title

  puts "#{index + 1}. 🛒 Title: #{title}"
  puts "   💰 Price: #{price}"
  puts "-" * 50
end
