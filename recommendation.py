from flask import Flask, request, jsonify

app = Flask(__name__)

# Sample data (you can replace this with a database or a real dataset)
sampleListings = [
    {
        "title": "Cozy Beachfront Cottage",
        "description": "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.",
        "price": 1500,
        "location": "Malibu",
        "country": "United States",
    },
    {
        "title": "Modern Loft in Downtown",
        "description": "Stay in the heart of the city in this stylish loft apartment. Perfect for urban explorers!",
        "price": 1200,
        "location": "New York City",
        "country": "United States",
    },{
    "title": "Mountain Retreat Cabin",
    "description": "Unwind in this peaceful cabin nestled in the mountains. Surrounded by nature and perfect for hiking enthusiasts.",
    "price": 1800,
    "location": "Aspen",
    "country": "United States"
},
{
    "title": "Luxury Villa in Santorini",
    "description": "Experience the beauty of Santorini in this luxurious villa with breathtaking views of the Aegean Sea.",
    "price": 3500,
    "location": "Santorini",
    "country": "Greece"
},
{
    "title": "Charming Parisian Apartment",
    "description": "Live like a local in this cozy Parisian apartment located in the heart of the city. Explore cafes, museums, and more!",
    "price": 2200,
    "location": "Paris",
    "country": "France"
},
{
    "title": "Cozy Ski Chalet",
    "description": "Ski directly from your door at this charming chalet in the Swiss Alps. Ideal for winter sports lovers.",
    "price": 2400,
    "location": "Zermatt",
    "country": "Switzerland"
},
{
    "title": "Beachfront Bungalow in Bali",
    "description": "Enjoy an idyllic tropical escape in this beautiful beachfront bungalow in Bali. Relax, surf, and explore.",
    "price": 2000,
    "location": "Bali",
    "country": "Indonesia"
},
{
    "title": "Urban Penthouse with City Views",
    "description": "Stay in this luxurious penthouse with panoramic city views. Perfect for those who love a modern, stylish vibe.",
    "price": 3500,
    "location": "Tokyo",
    "country": "Japan"
},
{
    "title": "Secluded Lakehouse",
    "description": "Relax and recharge at this secluded lakehouse surrounded by serene waters and lush forests. Ideal for peace and tranquility.",
    "price": 1600,
    "location": "Lake Tahoe",
    "country": "United States"
},
{
    "title": "Rustic Cabin in the Woods",
    "description": "Escape to this rustic cabin for a quiet getaway. Enjoy the peace and solitude of the woods while having modern comforts.",
    "price": 1400,
    "location": "Vermont",
    "country": "United States"
}

]

@app.route('/recommend', methods=['POST'])
def recommend():
    # Get search term from the POST request
    search_term = request.json.get('search', '').lower()
    price_range = request.json.get('price', None)

    # Filter listings based on title, description, or location
    recommendations = [
        listing for listing in sampleListings
        if search_term in listing["title"].lower()
        or search_term in listing["description"].lower()
        or search_term in listing["location"].lower()
    ]

    # Optional: Filter by price range
    if price_range:
        recommendations = [
            listing for listing in recommendations
            if abs(listing["price"] - price_range) <= 300
        ]

    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(debug=True)
