from models import db, Likes, Fun_times, Comment_fun_times
from flask import request, jsonify, Blueprint
from werkzeug.security import generate_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_, func
from datetime import datetime

funtime_bp = Blueprint('funtime_bp', __name__)

@funtime_bp.route('/fun_times', methods=['GET'])
def get_fun_times():
    fun_times = Fun_times.query.all()
    
    output = []
    for fun_time in fun_times:
        total_likes = db.session.query(func.count(Likes.id)).filter(Likes.fun_time_id == fun_time.id).scalar()
        fun_time_data = {
            'funtimeId': fun_time.id,
            'description': fun_time.description,
            'image_data': fun_time.image_data,
            'category': fun_time.category,
            'total_likes': total_likes,
            'comments': [{
                'id': comment.id,
                'text': comment.text,
                'username': comment.user.username,
                'image': comment.user.image_url,
                'dateCreated': comment.created_at,
                'updated_at': comment.updated_at
            } for comment in fun_time.comments]
        }
        output.append(fun_time_data)
    
    return jsonify({'fun_times': output})

@funtime_bp.route('/user-fun_times', methods=['GET'])
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
            'image_data': fun_time.image_data,
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

@funtime_bp.route('/add-fun_time', methods=['POST'])
@jwt_required()
def add_fun_time():
    current_user = get_jwt_identity()
    data = request.get_json()
    new_fun_time = Fun_times(
        description=data['description'],
        image_data=data['image_data'],
        category=data['category'],
        user_id=current_user
    )
    db.session.add(new_fun_time)
    db.session.commit()
    return jsonify({'message': 'New Fun-Time created!'})

@funtime_bp.route('/update-fun_time/<int:fun_time_id>', methods=['PUT'])
@jwt_required()
def update_fun_time(fun_time_id):
    current_user = get_jwt_identity()
    fun_time = Fun_times.query.filter_by(id=fun_time_id, user_id=current_user).first()
    if not fun_time:
        return jsonify({'message': 'Fun-Time not found or you are not authorized to update this Fun-Time'}), 404
    data = request.get_json()
    fun_time.description = data.get('description', fun_time.description)
    fun_time.category = data.get('category', fun_time.category)
    fun_time.image_data = data.get('image_data', fun_time.image_data)
    db.session.commit()
    return jsonify({'message': 'Fun-Time updated successfully'})

@funtime_bp.route('/delete-fun_time/<int:fun_time_id>', methods=['DELETE'])
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
@funtime_bp.route('/most-liked-fun_time', methods=['GET'])
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
            'image_data': fun_time.image_data,
            'like_count': like_count
        }
    })

@funtime_bp.route('/comment-fun_time/<int:fun_time_id>', methods=['POST'])
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

@funtime_bp.route('/update-comment-fun_time/<int:comment_id>', methods=['PUT'])
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

@funtime_bp.route('/delete-comment-fun_time/<int:comment_id>', methods=['DELETE'])
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

@funtime_bp.route('/toggle-like-fun_time/<int:fun_time_id>', methods=['POST'])
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
            'image_data': fun_time.image_data,
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
@funtime_bp.route('/fun_times/latest', methods=['GET'])
def get_latest_fun_times():
    latest_fun_times = Fun_times.query.order_by(Fun_times.created_at.desc()).limit(10).all()
    
    output = []
    for fun_time in latest_fun_times:
        total_likes = db.session.query(func.count(Likes.id)).filter(Likes.fun_time_id == fun_time.id).scalar()
        fun_time_data = {
            'id': fun_time.id,
            'description': fun_time.description,
            'image_data': fun_time.image_data,
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
@funtime_bp.route('/fun_times/funny', methods=['GET'])
def get_funny_fun_times():
    return get_fun_times_by_category('Funny')

# Route to get educational fun_times
@funtime_bp.route('/fun_times/educational', methods=['GET'])
def get_educational_fun_times():
    return get_fun_times_by_category('Educational')

# Route to get events fun_times
@funtime_bp.route('/fun_times/events', methods=['GET'])
def get_events_fun_times():
    return get_fun_times_by_category('Events')
