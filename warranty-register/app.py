from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv
from datetime import datetime
import hashlib
import hmac

load_dotenv()

app = Flask(__name__)
CORS(app, origins=os.getenv('ALLOWED_ORIGINS', '*').split(','))

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'database': os.getenv('DB_NAME', 'warranty_db'),
    'user': os.getenv('DB_USER', 'warranty_user'),
    'password': os.getenv('DB_PASSWORD', ''),
    'port': os.getenv('DB_PORT', '5432')
}

# API Security - API Key authentication
API_KEY = os.getenv('API_KEY', '')
API_KEY_HEADER = 'X-API-Key'

def get_db_connection():
    """Create and return a database connection"""
    return psycopg2.connect(**DB_CONFIG)

def init_db():
    """Initialize the database tables"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Create warranty_registrations table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS warranty_registrations (
            id SERIAL PRIMARY KEY,
            asset_id VARCHAR(255) NOT NULL,
            asset_name VARCHAR(255) NOT NULL,
            category_id VARCHAR(255),
            department_id VARCHAR(255),
            date_purchased DATE,
            cost DECIMAL(10, 2),
            registered_by VARCHAR(255) NOT NULL,
            registered_by_name VARCHAR(255) NOT NULL,
            organization_id VARCHAR(255),
            registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(asset_id, organization_id)
        )
    """)
    
    # Create indexes for performance
    cur.execute("CREATE INDEX IF NOT EXISTS idx_warranty_org ON warranty_registrations(organization_id)")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_warranty_user ON warranty_registrations(registered_by)")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_warranty_asset ON warranty_registrations(asset_id)")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_warranty_registered_at ON warranty_registrations(registered_at DESC)")
    
    conn.commit()
    cur.close()
    conn.close()

def verify_api_key():
    """Verify API key from request header"""
    if not API_KEY:
        return True  # Allow if no API key is set (development)
    
    provided_key = request.headers.get(API_KEY_HEADER)
    if not provided_key:
        return False
    
    # Use constant-time comparison to prevent timing attacks
    return hmac.compare_digest(provided_key, API_KEY)

@app.before_request
def before_request():
    """Verify API key before processing requests"""
    if request.method != 'OPTIONS' and not verify_api_key():
        return jsonify({'error': 'Unauthorized: Invalid or missing API key'}), 401

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        conn = get_db_connection()
        conn.close()
        return jsonify({'status': 'healthy', 'database': 'connected'}), 200
    except Exception as e:
        return jsonify({'status': 'unhealthy', 'error': str(e)}), 500

@app.route('/api/register', methods=['POST'])
def register_warranty():
    """Register an asset for warranty"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['assetId', 'assetName', 'registeredBy', 'registeredByName']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Check if already registered
        cur.execute("""
            SELECT id FROM warranty_registrations 
            WHERE asset_id = %s AND organization_id = %s
        """, (data['assetId'], data.get('organizationId')))
        
        if cur.fetchone():
            cur.close()
            conn.close()
            return jsonify({'error': 'Asset already registered for warranty'}), 409
        
        # Insert warranty registration
        cur.execute("""
            INSERT INTO warranty_registrations 
            (asset_id, asset_name, category_id, department_id, date_purchased, 
             cost, registered_by, registered_by_name, organization_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *
        """, (
            data['assetId'],
            data['assetName'],
            data.get('categoryId'),
            data.get('departmentId'),
            data.get('datePurchased'),
            data.get('cost'),
            data['registeredBy'],
            data['registeredByName'],
            data.get('organizationId')
        ))
        
        registration = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Warranty registered successfully',
            'registration': dict(registration)
        }), 201
        
    except psycopg2.IntegrityError as e:
        return jsonify({'error': 'Asset already registered for warranty'}), 409
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/registrations', methods=['GET'])
def get_registrations():
    """Get all warranty registrations (for Warranty Centre)"""
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Get all registrations ordered by most recent
        cur.execute("""
            SELECT 
                id, asset_id, asset_name, category_id, department_id,
                date_purchased, cost, registered_by, registered_by_name,
                organization_id, registered_at
            FROM warranty_registrations
            ORDER BY registered_at DESC
        """)
        
        registrations = cur.fetchall()
        cur.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'registrations': [dict(reg) for reg in registrations]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/registrations/<asset_id>', methods=['GET'])
def get_registration_by_asset(asset_id):
    """Check if an asset is registered for warranty"""
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute("""
            SELECT * FROM warranty_registrations 
            WHERE asset_id = %s
            LIMIT 1
        """, (asset_id,))
        
        registration = cur.fetchone()
        cur.close()
        conn.close()
        
        if registration:
            return jsonify({
                'success': True,
                'registered': True,
                'registration': dict(registration)
            }), 200
        else:
            return jsonify({
                'success': True,
                'registered': False
            }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    init_db()
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=os.getenv('FLASK_DEBUG', 'False') == 'True')
else:
    # Initialize DB when running with Gunicorn
    init_db()

