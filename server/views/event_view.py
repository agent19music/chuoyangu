from models import db, Users, Events, Comment_events
from flask import request, jsonify, Blueprint,make_response
from werkzeug.security import generate_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_, func
from datetime import datetime
import base64
from flask import request
import json
import base64

event_bp = Blueprint('event_bp', __name__)

@event_bp.route('/events', methods=['GET'])
def get_events():
    events = Events.query.all()
    output = [{
        'eventId': event.id,
        'title': event.title,
        'description': event.description,
        'poster': base64.b64encode(event.image_data).decode() if event.image_data else None,
        'start_time': event.start_time,
        'end_time': event.end_time,
        'date': event.date_of_event.strftime('%d %b %Y'),
        'entry_fee': event.entry_fee,
        'category': event.category,
        'comments': [{
            'id': comment.id,
            'text': comment.text,
            'image': base64.b64encode(comment.user.image_data).decode() if comment.user.image_data else None,
            'username': comment.user.username,
            'dateCreated': comment.created_at
        } for comment in event.comments]
    } for event in events]
    return make_response(jsonify(output), 200)
    

@event_bp.route('/events/<int:event_id>', methods=['GET'])
def get_specific_event(event_id):
    event = Events.query.get(event_id)
    if not event:
        return jsonify({'message': 'Event not found'}), 404
    
    output = {
        'eventId': event.id, 
        'title': event.title, 
        'poster': base64.b64encode(event.image_data).decode() if event.image_data else None,
        'description': event.description, 
        'start_time': event.start_time, 
        'end_time': event.end_time, 
        'date': event.date_of_event.strftime('%d %b %Y'),
        'entry_fee': event.Entry_fee,
        'category': event.category,
        'comments': [{
            'id': comment.id,
            'text': comment.text, 
            'image': base64.b64encode(comment.user.image_data).decode() if comment.user.image_data else None,
            'username': comment.user.username, 
            'dateCreated': comment.created_at 
        } for comment in event.comments]
    }
    
    return jsonify(output)

@event_bp.route('/add-event', methods=['POST'])
@jwt_required()
def add_event():
    try:
        current_user = get_jwt_identity()

        # Determine if the request is JSON or form-data
        if request.is_json:
            data = request.get_json()
        else:
            data = {key: request.form[key] for key in request.form}

        # Extract event details
        title = data.get('title')
        description = data.get('description')
        date_of_event_str = data.get('date_of_event')
        start_time_str = data.get('start_time')
        end_time_str = data.get('end_time')
        entry_fee = data.get('entry_fee')
        category = data.get('category')

        # Check for missing fields
        if not all([title, description, date_of_event_str, start_time_str, end_time_str, entry_fee, category]):
            return make_response(jsonify({"error": "Missing required fields"}), 400)

        # Parse date and time strings into datetime objects
        date_of_event = datetime.strptime(date_of_event_str, "%Y-%m-%d")
        start_time = datetime.strptime(start_time_str, '%I:%M %p').time()
        end_time = datetime.strptime(end_time_str, '%I:%M %p').time()

        # Combine date and time into datetime objects
        start_datetime = datetime.combine(date_of_event, start_time)
        end_datetime = datetime.combine(date_of_event, end_time)

        # Access the image file
        image_file = request.files.get('image_data')
        image_data = image_file.read() if image_file else None

        # Create new event
        new_event = Events(
            title=title,
            description=description,
            start_time=start_datetime,
            end_time=end_datetime,
            date_of_event=date_of_event,
            entry_fee=entry_fee,
            category=category,
            image_data=image_data,
            user_id=current_user
        )

        db.session.add(new_event)
        db.session.commit()

        return make_response(jsonify({"message": "New event created!"}), 201)
    except Exception as e:
        db.session.rollback()
        return make_response(jsonify({"error": str(e)}), 500)

@event_bp.route('/update-event/<int:event_id>', methods=['PUT'])
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
    event.category = data.get('category', event.category)
    event.Entry_fee = data.get('Entry_fee', event.Entry_fee)

    # Decode and update the image data from base64 if provided
    image_data = data.get('image_data')
    if image_data:
        event.image_data = base64.b64decode(image_data)

    db.session.commit()
    return jsonify({'message': 'Event updated successfully'})

@event_bp.route('/delete-event/<int:event_id>', methods=['DELETE'])
@jwt_required()
def delete_event(event_id):
    current_user = get_jwt_identity()
    event = Events.query.filter_by(id=event_id, user_id=current_user).first()
    if not event:
        return jsonify({'message': 'Event not found or you are not authorized to delete this event'}), 404
    db.session.delete(event)
    db.session.commit()
    return jsonify({'message': 'Event deleted successfully'})

@event_bp.route('/comment-event/<int:event_id>', methods=['POST'])
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

@event_bp.route('/update-comment-event/<int:comment_id>', methods=['PUT'])
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

@event_bp.route('/delete-comment-event/<int:comment_id>', methods=['DELETE'])
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
