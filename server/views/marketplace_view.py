from models import db, Products, Wishlists, Reviews, Users
from flask import request, jsonify, Blueprint
from werkzeug.security import generate_password_hash
from flask_jwt_extended import  jwt_required, get_jwt_identity
from sqlalchemy import or_, func
from datetime import datetime

marketplace_bp = Blueprint('marketplace_bp', __name__)

@marketplace_bp.route('/marketplace', methods=['GET'])
def get_marketplace():
    products = Products.query.all()
    output = []
    for product in products:
        # Calculate the average rating for the product
        average_rating = db.session.query(func.avg(Reviews.rating)).filter(Reviews.product_id == product.id).scalar()
        if average_rating is None:
            average_rating = 0  # If there are no reviews, set average rating to 0
        else:
            average_rating = round(average_rating, 1)  # Round the average rating to one decimal place
        
        # Get the reviews associated with the product
        reviews = []
        for review in product.reviews:
            review_data = {
                'id': review.id,
                'text': review.text,
                'rating': review.rating,
                'username': review.user.username,  # Get the username of the user who posted the review
                'user_image_url': review.user.image_url  # Get the image URL of the user who posted the review
            }
            reviews.append(review_data)
        
        # Include the contact information of the product
        contact_info = product.contact_info if product.contact_info else product.user.phone_no
        
        # Construct the product data including the reviews and contact info
        product_data = {
            'id': product.id, 
            'title': product.title, 
            'description': product.description,
            'price': product.price, 
            'image_url': product.image_url, 
            'category': product.category,
            'average_rating': average_rating,  # Include the average rating in the response
            'reviews': reviews,  # Include the reviews associated with the product
            'contact_info': contact_info  # Include the contact information of the product
        }
        output.append(product_data)
    
    return jsonify({'products': output})

# Route to get a specific product by id
@marketplace_bp.route('/product/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Products.query.filter_by(id=product_id).first()
    if not product:
        return jsonify({'message': 'Product not found'}), 404
    
    # Calculate the average rating for the product
    average_rating = db.session.query(func.avg(Reviews.rating)).filter(Reviews.product_id == product.id).scalar()
    if average_rating is None:
        average_rating = 0  # If there are no reviews, set average rating to 0
    else:
        average_rating = round(average_rating, 1)
                
    reviews = []
    for review in product.reviews:
        review_data = {
            'id': review.id,
            'text': review.text,
            'rating': review.rating,
            'username': review.user.username,  # Get the username of the user who posted the review
            'user_image_url': review.user.image_url  # Get the image URL of the user who posted the review
        }
        reviews.append(review_data)
    
    # Include the contact information of the product
    contact_info = product.contact_info if product.contact_info else product.user.phone_no
    
    return jsonify({'product': {
        'id': product.id, 
        'username': product.user.last_name,
        'contact_info': contact_info,  # Include the contact information in the response
        'title': product.title, 
        'description': product.description, 
        'price': product.price,
        'image_url': product.image_url,
        'category': product.category,
        'average_rating': average_rating,  # Include the average rating in the response
        'reviews': reviews
    }})

# Route to get products created by the logged-in user
@marketplace_bp.route('/my-products', methods=['GET'])
@jwt_required()
def get_my_products():
    current_user = get_jwt_identity()
    products = Products.query.filter_by(user_id=current_user).all()
    output = []
    for product in products:
        # Calculate the average rating for each product
        average_rating = db.session.query(func.avg(Reviews.rating)).filter(Reviews.product_id == product.id).scalar()
        if average_rating is None:
            average_rating = 0  # If there are no reviews, set average rating to 0
        else:
            average_rating = round(average_rating, 1)  # Round the average rating to one decimal place
            
        reviews = []
        for review in product.reviews:
            review_data = {
                'id': review.id,
                'text': review.text,
                'rating': review.rating,
                'username': review.user.username,  # Get the username of the user who posted the review
                'user_image_url': review.user.image_url  # Get the image URL of the user who posted the review
            }
            reviews.append(review_data)
        
        # Include the contact information of the product
        contact_info = product.contact_info if product.contact_info else Users.query.filter_by(id=current_user).first().phone_no
        
        product_data = {
            'id': product.id,
            'title': product.title,
            'description': product.description,
            'price': product.price,
            'image_url': product.image_url,
            'category': product.category,
            'contact_info': contact_info,  # Include the contact information in the response
            'average_rating': average_rating,
            'reviews': reviews
        }
        output.append(product_data)
    return jsonify({'my_products': output})

# Route to create a new product
@marketplace_bp.route('/create-product', methods=['POST'])
@jwt_required()
def create_product():
    current_user = get_jwt_identity()
    data = request.get_json()
     
    # Check if the request contains contact_info, otherwise use the user's phone number
    contact_info = data.get('contact_info') if data.get('contact_info') else Users.query.filter_by(id=current_user).first().phone_no
    
    new_product = Products(
        title=data['title'],
        description=data['description'],
        price=data['price'],
        image_url=data['image_url'], 
        category=data['category'],
        contact_info=contact_info,
        user_id=current_user
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify({'message': 'Product created successfully'})

# Route to update a product
@marketplace_bp.route('/update-product/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    current_user = get_jwt_identity()
    product = Products.query.filter_by(id=product_id).first()
    
    # Check if the product exists
    if not product:
        return jsonify({'message': 'Product not found'}), 404
    
    # Check if the current user is the owner of the product
    if product.user_id != current_user:
        return jsonify({'message': 'Unauthorized'}), 401
    
    data = request.get_json()
    product.title = data.get('title', product.title)
    product.description = data.get('description', product.description)
    product.price = data.get('price', product.price)
    product.category = data.get('category', product.category)
    product.contact_info = data.get('contact_info', product.contact_info)
    product.image_url = data.get('image_url', product.image_url)
    
    # # Update the contact information if provided; otherwise, keep the existing one
    # if 'contact_info' in data:
    #     product.contact_info = data['contact_info']
    # else:
    #     product.contact_info = product.user.phone_no
    
    db.session.commit()
    return jsonify({'message': 'Product updated successfully'})

# Route to delete a product
@marketplace_bp.route('/delete-product/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    current_user = get_jwt_identity()
    product = Products.query.filter_by(id=product_id).first()
    
    # Check if the product exists
    if not product:
        return jsonify({'message': 'Product not found'}), 404
    
    # Check if the current user is the owner of the product
    if product.user_id != current_user:
        return jsonify({'message': 'Unauthorized'}), 401
    
    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Product deleted successfully'})

def get_products_by_category(category):
    products = Products.query.filter_by(category=category).all()
    output = []
    for product in products:
        # Calculate the average rating for each product
        average_rating = db.session.query(func.avg(Reviews.rating)).filter(Reviews.product_id == product.id).scalar()
        if average_rating is None:
            average_rating = 0  # If there are no reviews, set average rating to 0
        else:
            average_rating = round(average_rating, 1)  # Round the average rating to one decimal place

        # Get reviews associated with the product
        reviews = [{
            'id': review.id,
            'text': review.text,
            'rating': review.rating,
            'username': review.user.username,
            'user_image_url': review.user.image_url
        } for review in product.reviews]

        # Determine the contact information for the product
        if product.contact_info:
            contact_info = product.contact_info
        else:
            contact_info = product.user.phone_no

        # Include product data along with reviews and contact info
        product_data = {
            'id': product.id,
            'title': product.title,
            'description': product.description,
            'price': product.price,
            'image_url': product.image_url,
            'category': product.category,
            'average_rating': average_rating,
            'reviews': reviews,
            'contact_info': contact_info  # Add contact info to the product data
        }
        output.append(product_data)
    return output

# Route to the tech category in the market place
@marketplace_bp.route('/marketplace/tech', methods=['GET'])
def get_tech_category():
    return jsonify({'products': get_products_by_category('Tech')})

# Route to the food category in the market place
@marketplace_bp.route('/marketplace/food', methods=['GET'])
def get_food_category():
    return jsonify({'products': get_products_by_category('Food')})

# Route to accessories category in the market place
@marketplace_bp.route('/marketplace/accessories', methods=['GET'])
def get_accessories_category():
    return jsonify({'products': get_products_by_category('Accessories')})

# Route to clothing category in the market place
@marketplace_bp.route('/marketplace/clothing', methods=['GET'])
def get_clothing_category():
    return jsonify({'products': get_products_by_category('Clothing')})

# Route to art category in the market place
@marketplace_bp.route('/marketplace/art', methods=['GET'])
def get_art_category():
    return jsonify({'products': get_products_by_category('Art')})

# Route to get the highest-rated product
@marketplace_bp.route('/marketplace/highest-rated', methods=['GET'])
def get_highest_rated_product():
    products = Products.query.all()

    # Calculate average ratings for all products
    product_ratings = []
    for product in products:
        average_rating = db.session.query(func.avg(Reviews.rating)).filter(Reviews.product_id == product.id).scalar()
        if average_rating is None:
            average_rating = 0
        product_ratings.append((product, average_rating))

    # Sort products by average rating in descending order
    sorted_products = sorted(product_ratings, key=lambda x: x[1], reverse=True)

    # Get the highest-rated product
    highest_rated_product = sorted_products[0]

    # Determine the contact information for the product
    if highest_rated_product[0].contact_info:
        contact_info = highest_rated_product[0].contact_info
    else:
        contact_info = highest_rated_product[0].user.phone_no

    # Prepare the response including contact info
    product_data = {
        'id': highest_rated_product[0].id,
        'title': highest_rated_product[0].title,
        'description': highest_rated_product[0].description,
        'price': highest_rated_product[0].price,
        'image_url': highest_rated_product[0].image_url,
        'category': highest_rated_product[0].category,
        'average_rating': round(highest_rated_product[1], 1),  # Round the average rating to one decimal place
        'reviews': [
            {
                'id': review.id,
                'text': review.text,
                'rating': review.rating,
                'username': review.user.username,
                'user_image_url': review.user.image_url
            }
            for review in highest_rated_product[0].reviews
        ],
        'contact_info': contact_info  # Add contact info to the response
    }

    return jsonify({'highest_rated_product': product_data})

# Route to add a review and rating
@marketplace_bp.route('/product/<int:product_id>/review', methods=['POST'])
@jwt_required()
def add_review(product_id):
    current_user = get_jwt_identity()
    product = Products.query.get(product_id)
    
    if not product:
        return jsonify({'message': 'Product not found'}), 404
    
    data = request.get_json()
    review_text = data.get('text')
    rating = int(data.get('rating'))
    
    if not review_text:
        return jsonify({'message': 'Review text is required'}), 400
    if not rating:
        return jsonify({'message': 'Rating is required'}), 400
    # If rating is not between 0-5 return error: rating should be between 0 and 5
    if rating < 0 or rating > 5:
        return jsonify({'message': 'Rating should be between 0 and 5'}), 400

  
    new_review = Reviews(
        text=review_text,
        rating=rating,
        user_id=current_user,
        product_id=product_id
    )
    
    db.session.add(new_review)
    db.session.commit()
    
    # Return the details of the newly added review in the response
    review_details = {
        'id': new_review.id,
        'text': new_review.text,
        'rating': new_review.rating,
        'user_id': new_review.user_id,
        'product_id': new_review.product_id
    }
    
    return jsonify({'message': 'Review added successfully', 'review': review_details}), 201


# Route to update a review
@marketplace_bp.route('/review/<int:review_id>', methods=['PUT'])
@jwt_required()
def update_review(review_id):
    current_user = get_jwt_identity()
    review = Reviews.query.get(review_id)

    if not review:
        return jsonify({'message': 'Review not found'}), 404

    if review.user_id != current_user:
        return jsonify({'message': 'Unauthorized to update this review'}), 403

    data = request.get_json()
    text = data.get('text')
    rating = data.get('rating')

    if not text:
        return jsonify({'message': 'Review text is required'}), 400
    if not rating:
        return jsonify({'message': 'Rating is required'}), 400

    review.text = text
    review.rating = rating
    db.session.commit()

    return jsonify({'message': 'Review updated successfully'}), 200


# Route to delete a review
@marketplace_bp.route('/review/<int:review_id>', methods=['DELETE'])
@jwt_required()
def delete_review(review_id):
    current_user = get_jwt_identity()
    review = Reviews.query.get(review_id)

    if not review:
        return jsonify({'message': 'Review not found'}), 404

    if review.user_id != current_user:
        return jsonify({'message': 'Unauthorized to delete this review'}), 403

    db.session.delete(review)
    db.session.commit()
    return jsonify({'message': 'Review deleted successfully'}), 200

@marketplace_bp.route('/product/<int:product_id>/reviews', methods=['GET'])
def get_reviews(product_id):
    product = Products.query.get(product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404

    reviews = []
    for review in product.reviews:
        user = Users.query.get(review.user_id)
        if user:
            review_data = {
                'id': review.id,
                'text': review.text,
                'rating': review.rating,
                'username': user.username,
                'userImage': user.image_url
            }
            reviews.append(review_data)

    return jsonify({'reviews': reviews})



# Wishlist Routes
@marketplace_bp.route('/wishlists/add/<int:product_id>', methods=['POST'])
@jwt_required()
def add_to_wishlists(product_id):
    current_user_id = get_jwt_identity()
    wishlists_item = Wishlists.query.filter_by(user_id=current_user_id, product_id=product_id).first()
    if wishlists_item:
        return jsonify({'message': 'Product already in wishlists'}), 400
    new_wishlists_item = Wishlists(user_id=current_user_id, product_id=product_id)
    db.session.add(new_wishlists_item)
    db.session.commit()
    return jsonify({'message': 'Product added to wishlists successfully'}), 201

@marketplace_bp.route('/wishlists', methods=['GET'])
@jwt_required()
def get_wishlists():
    current_user_id = get_jwt_identity()
    wishlists_items = Wishlists.query.filter_by(user_id=current_user_id).all()
    wishlists = []
    for item in wishlists_items:
        product = Products.query.get(item.product_id)
        user = Users.query.get(product.user_id)
        
        if product.contact_info:
            contact_info = product.contact_info
        else:
            contact_info = user.phone_no
        
        wishlists.append({
            'wishlists_item_id': item.id,
            'product_title': product.title,
            'product_description': product.description,
            'product_price': product.price,
            'product_image_url': product.image_url,
            'product_category': product.category,
            'seller_first_name': user.first_name,
            'seller_last_name': user.last_name,
            'seller_email': user.email,
            'seller_contact_info': contact_info,  # Use contact info here
            'seller_image_url': user.image_url
        })
    return jsonify({'wishlists': wishlists})


@marketplace_bp.route('/wishlists/remove/<int:wishlists_item_id>', methods=['DELETE'])
@jwt_required()
def remove_from_wishlists(wishlists_item_id):
    current_user_id = get_jwt_identity()
    wishlists_item = Wishlists.query.filter_by(id=wishlists_item_id, user_id=current_user_id).first()
    if not wishlists_item:
        return jsonify({'message': 'Wishlists item not found'}), 404
    db.session.delete(wishlists_item)
    db.session.commit()
    return jsonify({'message': 'Product removed from wishlists successfully'})

