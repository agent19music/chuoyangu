from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, time
from sqlalchemy import or_
from sqlalchemy import desc, asc, func
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models import db, Users, Events, Fun_times, Products, Likes, Comment_events, Comment_fun_times, Reviews, Wishlists
from datetime import timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from views import *

import bcrypt


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'vsgewvwesvsgevafdsag'  
app.config['JWT_SECRET_KEY'] = 'vsgewvwesvsgevafdsag'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)  # Set token expiration time
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Set maximum content length for incoming requests to 16 MB

db.init_app(app)
migrate = Migrate(app, db)
CORS(app)

app.register_blueprint(user_bp)
app.register_blueprint(marketplace_bp)
app.register_blueprint(event_bp)
app.register_blueprint(funtime_bp)
app.register_blueprint(auth_bp)
jwt = JWTManager(app)

@app.route('/')
def index():
    return jsonify({'message': 'Welcome to our App API'})

'''

START OF PROFILE ROUTES

'''


@app.route("/signup", methods=["POST"])
def add_users():
    try:
        data = request.get_json()

        required_fields = ["username", "email", "password", "first_name", "last_name", "category", "gender"]
        for field in required_fields:
            if field not in data:
                return jsonify({"message": f"{field} is required"}), 400

        existing_user = Users.query.filter(or_(Users.username == data["username"], Users.email == data["email"])).first()
        if existing_user:
            return jsonify({"message": "Username or email already exists"}), 400

        hashed_password = generate_password_hash(data["password"])

        new_user = Users(
            first_name=data.get("first_name", ""),
            last_name=data.get("last_name", ""),
            username=data['username'],
            email=data["email"],
            password=hashed_password,
            phone_no=data.get("phone_no", ""),
            category=data.get("category"),
            image_url=data.get("image_url", ""),
            gender=data.get("gender")
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User added successfully"}), 201
    except AssertionError as e:
        return jsonify({"message": str(e)}), 400
    except Exception as e:
        print(str(e))
        db.session.rollback()
        return jsonify({"message": "Internal Server Error"}), 500

# To log in you require to provide ur username and password
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username:
        return jsonify(message="Username is required"), 400

    user = Users.query.filter_by(username=username).first()
    if user :
        if check_password_hash(user.password, password):
           access_token = create_access_token(identity=user.id)
           return jsonify(access_token=access_token), 200
    else:
        return jsonify(message="Invalid username, or password"), 401

# Route to get a specific user by id
@app.route('/users/<int:user_id>', methods=['GET']) 
def get_user(user_id):
    user = Users.query.get(user_id)
    if user:
        return jsonify({'user': {'first_name': user.first_name, 'last_name': user.last_name, 'email': user.email, 'username': user.username, 'phone_no': user.phone_no, 'category': user.category, 'image_url': user.image_url, 'gender': user.gender}})
    else:
        return jsonify(message="User not found"), 404

@app.route('/reset_password', methods=['POST'])
def reset_password():
    data=request.get_json()
    email=data.get('email')
    new_password=data.get('new_password')
    username=data.get('username')

    user=Users.query.filter_by(username=username, email=email).first()

    if user:
        #Update the password
        user.password= generate_password_hash(new_password)
        db.session.commit()

        return jsonify({"message":"Password reset succesfully"}),200
    else:
        return jsonify({"error":"Invalid username or email"}), 404


@app.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    user = Users.query.get(current_user_id)
    
    if user:
        # Serialize user data
        user_data = {
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'username': user.username,
            'email': user.email,
            'phone_no': user.phone_no,
            'category': user.category,
            'image_url': user.image_url,
            'gender': user.gender
        }
        return jsonify(user_data), 200
    else:
        return jsonify(message="User not found"), 404

@app.route('/update-profile', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user = get_jwt_identity()
    user = Users.query.filter_by(id=current_user).first()
    if user:
        data = request.get_json()
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        user.phone_no = data.get('phone_no', user.phone_no)
        user.category = data.get('category', user.category)
        user.image_url = data.get('image_url', user.image_url)
        user.gender = data.get('gender', user.gender)
        db.session.commit()
        return jsonify({'message': 'Profile updated successfully'})
    else:
        return jsonify(message="User not found"), 404
        
@app.route("/authenticated_user", methods=["GET"])
@jwt_required()
def authenticated_user():
    current_user_id = get_jwt_identity() #geeting current user id
    user = Users.query.get(current_user_id)

    if user:
        user_data = {
            'id': user.id,
            'username':user.username,
            'email': user.email,
            'category': user.category,
            'image_url':user.image_url,
            'phone_no':user.phone_no,
            'first_name':user.first_name,
            'last_name':user.last_name,
            'gender': user.gender,
            'course': user.category,
            'joined': user.created_at
        }
        return jsonify(user_data), 200
    else:
        return jsonify({"error": "User not found"}), 404        



'''

END OF PROFILE ROUTES

'''




'''

START OF EVENT ROUTES

'''


# Routes for Events
@app.route('/events', methods=['GET'])
def get_events():
    events = Events.query.all()
    output = [{
        'eventId': event.id, 
        'title': event.title, 
        'description': event.description, 
        'poster': event.image_url,
        'start_time': event.start_time, 
        'end_time': event.end_time, 
        'date': event.date_of_event.strftime('%d %b %Y'),
        'entry_fee': event.Entry_fee,
        'category': event.category,
        'comments':[{
            'id': comment.id,
            'text': comment.text, 
            'image': comment.user.image_url,
            'username': comment.user.username,
            'dateCreated': comment.created_at  
        } for comment in event.comments]

        } for event in events]
    return jsonify({'events': output})

@app.route('/events/<int:event_id>', methods=['GET'])
def get_specific_event(event_id):
    event = Events.query.get(event_id)
    if not event:
        return jsonify({'message': 'Event not found'}), 404
    
    output = {
        'eventId': event.id, 
        'title': event.title, 
        'poster': event.image_url,
        'description': event.description, 
        'start_time': event.start_time, 
        'end_time': event.end_time, 
        'date': event.date_of_event.strftime('%d %b %Y'),
        'entry_fee': event.Entry_fee,
        'category': event.category,
        'comments': [{
            'id': comment.id,
            'text': comment.text, 
            'image': comment.user.image_url,
            'username': comment.user.username, 
            'dateCreated': comment.created_at 
        } for comment in event.comments]
    }
    
    return jsonify(output)

@app.route('/user-events', methods=['GET'])
@jwt_required()
def get_user_events():
    current_user = get_jwt_identity()
    user_events = Events.query.filter_by(user_id=current_user).all()
    
    output = []
    for event in user_events:
        event_data = {
            'id': event.id,
            'title': event.title,
            'description': event.description,
             'poster': event.image_url,
            'start_time': event.start_time.strftime('%I:%M %p'),  # Format start time
            'end_time': event.end_time.strftime('%I:%M %p'),  # Format end time
            'date': event.date_of_event.strftime('%d %b %Y'),  # Format date
            'entry_fee': event.Entry_fee,
            'category': event.category,
            'comments': []
        }
        
        # Fetch comments for the current event
        comments = Comment_events.query.filter_by(event_id=event.id).all()
        for comment in comments:
            comment_data = {
                'id': comment.id,
                'text': comment.text,
                'username': comment.user.username,
                'image': comment.user.image_url,
                'dateCreated': comment.created_at
            }
            event_data['comments'].append(comment_data)
        
        output.append(event_data)
    
    return jsonify({'user_events': output})


@app.route('/add-event', methods=['POST'])
@jwt_required()
def add_event():
    current_user = get_jwt_identity()
    data = request.get_json()

    # Parse date strings into datetime objects
    date_of_event = datetime.strptime(data['date_of_event'], '%d %b %Y')
    start_time = datetime.strptime(data['start_time'], '%I:%M %p').time()
    end_time = datetime.strptime(data['end_time'], '%I:%M %p').time()

    # Combine date and time into datetime objects
    start_datetime = datetime.combine(date_of_event, start_time)
    end_datetime = datetime.combine(date_of_event, end_time)

    new_event = Events(
        title=data['title'],
        description=data['description'],
        start_time=start_datetime,
        end_time=end_datetime,
        date_of_event=date_of_event,
        Entry_fee = data['Entry_fee'],
        category=data['category'],
        image_url=data.get('image_url'),
        user_id=current_user
    )
    db.session.add(new_event)
    db.session.commit()
    return jsonify({'message': 'New event created!'})

@app.route('/update-event/<int:event_id>', methods=['PUT'])
@jwt_required()
def update_event(event_id):
    current_user = get_jwt_identity()
    event = Events.query.filter_by(id=event_id, user_id=current_user).first()
    if not event:
        return jsonify({'message': 'Event not found or you are not authorized to update this event'}), 404

    data = request.get_json()

    # Parse date string into datetime object if provided
    if 'date_of_event' in data:
        event.date_of_event = datetime.strptime(data['date_of_event'], '%d %b %Y')

    # Parse start time string into time object if provided
    if 'start_time' in data:
        start_time = datetime.strptime(data['start_time'], '%I:%M %p').time()

    # Parse end time string into time object if provided
    if 'end_time' in data:
        end_time = datetime.strptime(data['end_time'], '%I:%M %p').time()

    # Combine date_of_event with start_time and end_time to create datetime objects
    if 'date_of_event' in data and 'start_time' in data:
        event.start_time = datetime.combine(event.date_of_event, start_time)

    if 'date_of_event' in data and 'end_time' in data:
        event.end_time = datetime.combine(event.date_of_event, end_time)

    

    # Update other fields
    event.title = data.get('title', event.title)
    event.description = data.get('description', event.description)
    event.image_url = data.get('image_url', event.image_url)
    event.category = data.get('category', event.category)
    event.Entry_fee = data.get('Entry_fee', event.Entry_fee)

    db.session.commit()
    return jsonify({'message': 'Event updated successfully'})


@app.route('/delete-event/<int:event_id>', methods=['DELETE'])
@jwt_required()
def delete_event(event_id):
    current_user = get_jwt_identity()
    event = Events.query.filter_by(id=event_id, user_id=current_user).first()
    if not event:
        return jsonify({'message': 'Event not found or you are not authorized to delete this event'}), 404
    db.session.delete(event)
    db.session.commit()
    return jsonify({'message': 'Event deleted successfully'})


@app.route('/comment-event/<int:event_id>', methods=['POST'])
@jwt_required()
def comment_event(event_id):
    current_user = get_jwt_identity()
    event = Events.query.get(event_id)
    
    if not event:
        return jsonify({'message': 'Event not found'}), 404
    
    data = request.get_json()
    comment_text = data.get('text')
    
    if not comment_text:
        return jsonify({'message': 'Comment text is required'}), 400
    
    new_comment = Comment_events(
        text=comment_text,
        user_id=current_user,
        event_id=event_id
    )
    
    db.session.add(new_comment)
    db.session.commit()
    
    return jsonify({'message': 'Comment added successfully'})


@app.route('/update-comment-event/<int:comment_id>', methods=['PUT'])
@jwt_required()
def update_comment_event(comment_id):
    current_user = get_jwt_identity()
    comment = Comment_events.query.get(comment_id)
    
    if not comment:
        return jsonify({'message': 'Comment not found'}), 404
    
    if comment.user_id != current_user:
        return jsonify({'message': 'You are not authorized to update this comment'}), 403
    
    data = request.get_json()
    new_comment_text = data.get('text')
    
    if not new_comment_text:
        return jsonify({'message': 'New comment text is required'}), 400
    
    comment.text = new_comment_text
    db.session.commit()
    
    return jsonify({'message': 'Comment updated successfully'})




@app.route('/delete-comment-event/<int:comment_id>', methods=['DELETE'])
@jwt_required()
def delete_comment(comment_id):
    current_user = get_jwt_identity()
    comment = Comment_events.query.get(comment_id)
    
    if not comment:
        return jsonify({'message': 'Comment not found'}), 404
    
    if comment.user_id != current_user:
        return jsonify({'message': 'You are not authorized to delete this comment'}), 403
    
    db.session.delete(comment)
    db.session.commit()
    
    return jsonify({'message': 'Comment deleted successfully'})


@app.route('/upcoming-events', methods=['GET'])
def get_upcoming_events():
    current_date = datetime.now()
    upcoming_events = Events.query.filter(Events.date_of_event >= current_date).order_by(Events.date_of_event).limit(10).all()
    
    output = []
    for event in upcoming_events:
        event_data = {
            'id': event.id,
            'title': event.title,
            'description': event.description,
            'poster': event.image_url,
            'start_time': event.start_time.strftime('%I:%M %p'),  # Format start time
            'end_time': event.end_time.strftime('%I:%M %p'),  # Format end time
            'entry_fee': event.Entry_fee,
            'date': event.date_of_event.strftime('%d %b %Y'),  # Format date
            'category': event.category,
            'comments': []
        }
        
        # Fetch comments for the current event
        comments = Comment_events.query.filter_by(event_id=event.id).all()
        for comment in comments:
            comment_data = {
                'id': comment.id,
                'text': comment.text,
                'username': comment.user.username,
                'image': comment.user.image_url,
                'dateCreated': comment.created_at 
            }
            event_data['comments'].append(comment_data)
        
        output.append(event_data)
    
    return jsonify({'upcoming_events': output})


@app.route('/past-events', methods=['GET'])
def get_past_events():
    current_date = datetime.now()
    past_events = Events.query.filter(Events.date_of_event < current_date).all()
    
    output = []
    for event in past_events:
        event_data = {
            'id': event.id,
            'title': event.title,
            'description': event.description,
            'poster': event.image_url,
            'start_time': event.start_time.strftime('%I:%M %p'),  # Format start time
            'end_time': event.end_time.strftime('%I:%M %p'),  # Format end time
            'date': event.date_of_event.strftime('%d %b %Y'),  # Format date
            'entry_fee': event.Entry_fee,
            'category': event.category,
            'comments': []
        }
        
        # Fetch comments for the current event
        comments = Comment_events.query.filter_by(event_id=event.id).all()
        for comment in comments:
            comment_data = {
                'id': comment.id,
                'text': comment.text,
                'username': comment.user.username,
                'image': comment.user.image_url,
                'dateCreated': comment.created_at 
            }
            event_data['comments'].append(comment_data)
        
        output.append(event_data)
    
    return jsonify({'past_events': output})


def get_event_by_category(category):
    events = Events.query.filter_by(category=category).all()
    
    output = []
    for event in events:
        event_data = {
            'id': event.id,
            'title': event.title,
            'description': event.description,
            'poster': event.image_url,
            'start_time': event.start_time.strftime('%I:%M %p'),  # Format start time
            'end_time': event.end_time.strftime('%I:%M %p'),  # Format end time
            'date': event.date_of_event.strftime('%d %b %Y'),  # Format date
            'entry_fee': event.Entry_fee,
            'category': event.category,
            'comments': []
        }
        
        # Fetch comments for the current event
        comments = Comment_events.query.filter_by(event_id=event.id).all()
        for comment in comments:
            comment_data = {
                'id': comment.id,
                'text': comment.text,
                'username': comment.user.username,
                'image': comment.user.image_url,
                'dateCreated': comment.created_at 
            }
            event_data['comments'].append(comment_data)
        
        output.append(event_data)
        
    return jsonify({'events': output})

@app.route('/events/fun', methods=['GET'])
def get_events_fun():
    return get_event_by_category('Fun')

@app.route('/events/educational', methods=['GET'])
def get_events_education():
    return get_event_by_category('Education')

@app.route('/events/social', methods=['GET'])
def get_events_social():
    return get_event_by_category('Social')


'''

END OF EVENT ROUTES

'''




'''

START OF FUNTIME ROUTES

'''


# Routes for Fun_times
@app.route('/fun_times', methods=['GET'])
def get_fun_times():
    fun_times = Fun_times.query.all()
    
    output = []
    for fun_time in fun_times:
        total_likes = db.session.query(func.count(Likes.id)).filter(Likes.fun_time_id == fun_time.id).scalar()
        fun_time_data = {
            'funtimeId': fun_time.id, 
            'description': fun_time.description, 
            'image_url': fun_time.image_url, 
            'category': fun_time.category,
            'total_likes': total_likes,
            'comments': [{
                'id': comment.id,
                'text': comment.text,  
                'username': comment.user.username ,
                'image': comment.user.image_url , 
                'dateCreated': comment.created_at,
                'updated_at': comment.updated_at
            } for comment in fun_time.comments]
        }
        output.append(fun_time_data)
    
    return jsonify({'fun_times': output})

@app.route('/user-fun_times', methods=['GET'])
@jwt_required()
def get_user_fun_times():
    current_user = get_jwt_identity()
    user_fun_times = Fun_times.query.filter_by(user_id=current_user).all()

    output = []
    for fun_time in user_fun_times:
        total_likes = db.session.query(func.count(Likes.id)).filter(Likes.fun_time_id == fun_time.id).scalar()
        fun_time_data = {
            'funtimeId': fun_time.id,
            'description': fun_time.description,
            'image_url': fun_time.image_url,
            'category': fun_time.category,
            'total_likes': total_likes,
            'comments': [{
                'id': comment.id,
                'text': comment.text,
                'username': comment.user.username,
                'dateCreated': comment.created_at
            } for comment in fun_time.comments]
        }
        output.append(fun_time_data)

    return jsonify({'user_fun_times': output})

@app.route('/get-fun_time/<int:funtimeId>', methods=['GET'])
def get_specific_funtime(funtimeId):
    fun_time = Fun_times.query.get(funtimeId)
    if not fun_time:
        return jsonify({'message': 'Funtime not found'}), 404
    
    output = {
        'funtimeId': fun_time.id,
            'description': fun_time.description,
            'image_url': fun_time.image_url,
            'category': fun_time.category,
    }
    
    return jsonify(output)    


@app.route('/add-fun_time', methods=['POST'])
@jwt_required()
def add_fun_time():
    current_user = get_jwt_identity()
    data = request.get_json()
    new_fun_time = Fun_times(description=data['description'], image_url=data['image_url'], category=data['category'], user_id=current_user)
    db.session.add(new_fun_time)
    db.session.commit()
    return jsonify({'message': 'New Fun-Time created!'})

@app.route('/update-fun_time/<int:fun_time_id>', methods=['PUT'])
@jwt_required()
def update_fun_time(fun_time_id):
    current_user = get_jwt_identity()
    fun_time = Fun_times.query.filter_by(id=fun_time_id, user_id=current_user).first()
    if not fun_time:
        return jsonify({'message': 'Fun-Time not found or you are not authorized to update this Fun-Time'}), 404
    data = request.get_json()
    fun_time.description = data.get('description', fun_time.description)
    fun_time.category = data.get('category', fun_time.category)
    fun_time.image_url = data.get('image_url', fun_time.image_url)
    db.session.commit()
    return jsonify({'message': 'Fun-Time updated successfully'})

@app.route('/delete-fun_time/<int:fun_time_id>', methods=['DELETE'])
@jwt_required()
def delete_fun_time(fun_time_id):
    current_user = get_jwt_identity()
    fun_time = Fun_times.query.filter_by(id=fun_time_id, user_id=current_user).first()
    if not fun_time:
        return jsonify({'message': 'Fun-Time not found or you are not authorized to delete this Fun-Time'}), 404
    db.session.delete(fun_time)
    db.session.commit()
    return jsonify({'message': 'Fun-Time deleted successfully'})

# Route for most liked Fun-Time
@app.route('/most-liked-fun_time', methods=['GET'])
def most_liked_fun_time():
    most_liked = db.session.query(Fun_times, func.count(Likes.id).label('like_count')).\
        outerjoin(Likes).\
        group_by(Fun_times).\
        order_by(func.count(Likes.id).desc()).\
        first()

    if not most_liked:
        return jsonify({'message': 'No Fun-Time found'}), 404

    fun_time, like_count = most_liked
    return jsonify({
        'most_liked_fun_time': {
            'id': fun_time.id,
            'description': fun_time.description,
            'category': fun_time.category,
            'image_url': fun_time.image_url,
            'like_count': like_count
        }
    })

@app.route('/comment-fun_time/<int:fun_time_id>', methods=['POST'])
@jwt_required()
def comment_fun_time(fun_time_id):
    current_user = get_jwt_identity()
    fun_time = Fun_times.query.get(fun_time_id)
    
    if not fun_time:
        return jsonify({'message': 'Fun-Time not found'}), 404
    
    data = request.get_json()
    comment_text = data.get('text')
    
    if not comment_text:
        return jsonify({'message': 'Comment text is required'}), 400
    
    new_comment = Comment_fun_times(
        text=comment_text,
        user_id=current_user,
        fun_time_id=fun_time_id
    )
    
    db.session.add(new_comment)
    db.session.commit()
    
    return jsonify({'message': 'Comment added successfully'})


@app.route('/update-comment-fun_time/<int:comment_id>', methods=['PUT'])
@jwt_required()
def update_comment_fun_time(comment_id):
    current_user = get_jwt_identity()
    comment = Comment_fun_times.query.get(comment_id)
    
    if not comment:
        return jsonify({'message': 'Comment not found'}), 404
    
    if comment.user_id != current_user:
        return jsonify({'message': 'You are not authorized to update this comment'}), 403
    
    data = request.get_json()
    new_comment_text = data.get('text')
    
    if not new_comment_text:
        return jsonify({'message': 'New comment text is required'}), 400
    
    comment.text = new_comment_text
    db.session.commit()
    
    return jsonify({'message': 'Comment updated successfully'})


@app.route('/delete-comment-fun_time/<int:comment_id>', methods=['DELETE'])
@jwt_required()
def delete_comment_fun_time(comment_id):
    current_user = get_jwt_identity()
    comment = Comment_fun_times.query.get(comment_id)
    
    if not comment:
        return jsonify({'message': 'Comment not found'}), 404
    
    if comment.user_id != current_user:
        return jsonify({'message': 'You are not authorized to delete this comment'}), 403
    
    db.session.delete(comment)
    db.session.commit()
    
    return jsonify({'message': 'Comment deleted successfully'})

@app.route('/toggle-like-fun_time/<int:fun_time_id>', methods=['POST'])
@jwt_required()
def toggle_like_fun_time(fun_time_id):
    current_user = get_jwt_identity()
    fun_time = Fun_times.query.get(fun_time_id)
    
    if not fun_time:
        return jsonify({'message': 'Fun-Time not found'}), 404
    
    existing_like = Likes.query.filter_by(user_id=current_user, fun_time_id=fun_time_id).first()
    if existing_like:
        # Unlike if already liked
        db.session.delete(existing_like)
        db.session.commit()
        return jsonify({'message': 'Fun-Time unliked successfully'})
    else:
        # Like if not already liked
        new_like = Likes(user_id=current_user, fun_time_id=fun_time_id)
        db.session.add(new_like)
        db.session.commit()
        return jsonify({'message': 'Fun-Time liked successfully'})


def get_fun_times_by_category(category):
    fun_times = Fun_times.query.filter_by(category=category).all()
    
    output = []
    for fun_time in fun_times:
        total_likes = db.session.query(func.count(Likes.id)).filter(Likes.fun_time_id == fun_time.id).scalar()
        fun_time_data = {
            'id': fun_time.id, 
            'description': fun_time.description, 
            'image_url': fun_time.image_url, 
            'category': fun_time.category,
            'total_likes': total_likes,
           
            'comments': [{
                'id': comment.id,
                'text': comment.text,  
                'username': comment.user.username    
            } for comment in fun_time.comments]
        }
        output.append(fun_time_data)
    
    return jsonify({'fun_times': output})

# Route to get latest fun_times
@app.route('/fun_times/latest', methods=['GET'])
def get_latest_fun_times():
    latest_fun_times = Fun_times.query.order_by(Fun_times.created_at.desc()).limit(10).all()
    
    output = []
    for fun_time in latest_fun_times:
        total_likes = db.session.query(func.count(Likes.id)).filter(Likes.fun_time_id == fun_time.id).scalar()
        fun_time_data = {
            'id': fun_time.id, 
            'description': fun_time.description, 
            'image_url': fun_time.image_url, 
            'category': fun_time.category,
            'created_at': fun_time.created_at,
            'total_likes': total_likes,
            'comments': [{
                'id': comment.id,
                'text': comment.text,  
                'username': comment.user.username    
            } for comment in fun_time.comments]
        }
        output.append(fun_time_data)
    
    return jsonify({'fun_times': output})

# Route to get funny fun_times
@app.route('/fun_times/funny', methods=['GET'])
def get_funny_fun_times():
    return get_fun_times_by_category('Funny')

# Route to get educational fun_times
@app.route('/fun_times/educational', methods=['GET'])
def get_educational_fun_times():
    return get_fun_times_by_category('Educational')

# Route to get events fun_times
@app.route('/fun_times/events', methods=['GET'])
def get_events_fun_times():
    return get_fun_times_by_category('Events')



'''

END OF FUNTIME ROUTES

'''



'''

START OF MARKETPLACE ROUTES

'''

# Route to get products from the marketplace
@app.route('/marketplace', methods=['GET'])
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
@app.route('/product/<int:product_id>', methods=['GET'])
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
@app.route('/my-products', methods=['GET'])
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
@app.route('/create-product', methods=['POST'])
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
@app.route('/update-product/<int:product_id>', methods=['PUT'])
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
@app.route('/delete-product/<int:product_id>', methods=['DELETE'])
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
@app.route('/marketplace/tech', methods=['GET'])
def get_tech_category():
    return jsonify({'products': get_products_by_category('Tech')})

# Route to the food category in the market place
@app.route('/marketplace/food', methods=['GET'])
def get_food_category():
    return jsonify({'products': get_products_by_category('Food')})

# Route to accessories category in the market place
@app.route('/marketplace/accessories', methods=['GET'])
def get_accessories_category():
    return jsonify({'products': get_products_by_category('Accessories')})

# Route to clothing category in the market place
@app.route('/marketplace/clothing', methods=['GET'])
def get_clothing_category():
    return jsonify({'products': get_products_by_category('Clothing')})

# Route to art category in the market place
@app.route('/marketplace/art', methods=['GET'])
def get_art_category():
    return jsonify({'products': get_products_by_category('Art')})

# Route to get the highest-rated product
@app.route('/marketplace/highest-rated', methods=['GET'])
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



# # Route to rate a product
# @app.route('/product/<int:product_id>/rate', methods=['POST'])
# @jwt_required()
# def rate_product(product_id):
#     current_user = get_jwt_identity()
#     data = request.get_json()
#     rating = data.get('rating')

#     if rating is None or not isinstance(rating, (int, float)) or rating < 0 or rating > 5:
#         return jsonify({'message': 'Invalid rating. Rating must be a number between 0 and 5.'}), 400

#     product = Products.query.get(product_id)
#     if not product:
#         return jsonify({'message': 'Product not found'}), 404

#     existing_review = Reviews.query.filter_by(user_id=current_user, product_id=product_id).first()
#     if existing_review:
#         existing_review.rating = rating
#     else:
#         new_review = Reviews(
#             rating=rating,
#             user_id=current_user,
#             product_id=product_id
#         )
#         db.session.add(new_review)

#     db.session.commit()
#     return jsonify({'message': 'Product rated successfully'}), 200


# Route to add a review and rating
@app.route('/product/<int:product_id>/review', methods=['POST'])
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
@app.route('/review/<int:review_id>', methods=['PUT'])
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
@app.route('/review/<int:review_id>', methods=['DELETE'])
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

@app.route('/product/<int:product_id>/reviews', methods=['GET'])
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
@app.route('/wishlists/add/<int:product_id>', methods=['POST'])
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

@app.route('/wishlists', methods=['GET'])
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


@app.route('/wishlists/remove/<int:wishlists_item_id>', methods=['DELETE'])
@jwt_required()
def remove_from_wishlists(wishlists_item_id):
    current_user_id = get_jwt_identity()
    wishlists_item = Wishlists.query.filter_by(id=wishlists_item_id, user_id=current_user_id).first()
    if not wishlists_item:
        return jsonify({'message': 'Wishlists item not found'}), 404
    db.session.delete(wishlists_item)
    db.session.commit()
    return jsonify({'message': 'Product removed from wishlists successfully'})



'''

END OF MARKETPLACE ROUTES

'''




'''

START OF STUDENT ROUTES

'''

# Route get all users in the database and return them as an array
@app.route('/users', methods=['GET'])
def get_users():
    users = Users.query.all()
    serialized_users = [{
        'id': user.id,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'username': user.username,
        'email': user.email,
        'phone_no': user.phone_no,
        'category': user.category,
        'image_url': user.image_url,
        'gender': user.gender
    } for user in users]
    return jsonify({'users': serialized_users})

def get_users_by_category(category):
    users = Users.query.filter_by(category=category).all()
    serialized_users = [{
        'id': user.id,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'username': user.username,
        'email': user.email,
        'category': user.category,
        'phone_no': user.phone_no,
        'image_url': user.image_url,
        'gender': user.gender
    } for user in users]
    return serialized_users


@app.route('/users/category/software_dev', methods=['GET'])
def get_software_dev():
    return jsonify({'users': get_users_by_category('Software Engineering')})

@app.route('/users/category/data_science', methods=['GET'])
def get_data_science():
    return jsonify({'users': get_users_by_category('Data Science')})

@app.route('/users/category/cybersec', methods=['GET'])
def get_cybersec():
    return jsonify({'users': get_users_by_category('Cybersec')})

@app.route('/users/category/ui_ux', methods=['GET'])
def get_ui_ux():
    return jsonify({'users': get_users_by_category('UI/UX')})



'''

END OF STUDENT ROUTES

'''

if __name__ == '__main__':
    app.run(debug=True)
