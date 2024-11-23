from flask import Flask, request, jsonify
from google.cloud import storage
import google.generativeai as genai
import json
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Configure Gemini API
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)

# Initialize Google Cloud Storage client
GCLOUD_PROJECT_ID = os.getenv("GCLOUD_PROJECT_ID")
GCLOUD_KEY_FILE = os.getenv("GCLOUD_KEY_FILE")
GCLOUD_BUCKET_NAME = os.getenv("GCLOUD_BUCKET_NAME")

storage_client = storage.Client.from_service_account_json(GCLOUD_KEY_FILE)
bucket_name = GCLOUD_BUCKET_NAME

class PRDMaker:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-pro')
        
    def _generate_content(self, prompt: str) -> str:
        """Generate content using Gemini API"""
        response = self.model.generate_content(prompt)
        return response.text
    
    def generate_overview(self, product_name: str, context: str) -> str:
        """Generate product overview"""
        prompt = f"""
        Create a comprehensive product overview for {product_name}.
        Context: {context}
        Please provide a clear, concise, yet detailed overview that explains:
        1. The product's purpose
        2. Key features
        3. Target audience
        4. Main value propositions
        
        Format the response in a professional manner suitable for a PRD.
        """
        return self._generate_content(prompt)
    
    def generate_darci_explanations(self, role: str, persons: list) -> str:
        """Generate DARCI role explanations"""
        role_descriptions = {
            "decider": "final decision-making authority",
            "accountable": "overall accountability for deliverables",
            "responsible": "doing the work",
            "consulted": "providing input and feedback",
            "informed": "kept updated on progress"
        }
        
        prompt = f"""
        Generate a clear explanation for the {role.upper()} role in the DARCI framework.
        Assigned persons: {', '.join(persons)}
        Role context: {role_descriptions[role.lower()]}
        
        Explain:
        1. Why these persons are suitable for this role
        2. Their specific responsibilities  
        3. How they should interact with other roles
        
        Keep the explanation concise but informative.
        """
        return self._generate_content(prompt)

class PRDGenerator:
    def __init__(self):
        self.prd_maker = PRDMaker()
        
    def create_prd(self, input_data: dict) -> dict:
        """Create complete PRD from input data"""
        prd = {
            "prd_identity": {
                "document_version": input_data.get("document_version", "1.0"),
                "product_name": input_data["product_name"],
                "document_owner": input_data["document_owner"],
                "developer": input_data["developer"],
                "stakeholder": input_data["stakeholder"],
                "document_stage": input_data["document_stage"]
            },
            "overview": self.prd_maker.generate_overview(
                input_data["product_name"],
                input_data.get("context", "")
            ),
            "darci": {
                "decider": {
                    "persons": input_data["darci"]["decider"],
                    "explanation": self.prd_maker.generate_darci_explanations("decider", input_data["darci"]["decider"])
                },
                "accountable": {
                    "persons": input_data["darci"]["accountable"],
                    "explanation": self.prd_maker.generate_darci_explanations("accountable", input_data["darci"]["accountable"])
                },
                "responsible": {
                    "persons": input_data["darci"]["responsible"],
                    "explanation": self.prd_maker.generate_darci_explanations("responsible", input_data["darci"]["responsible"])
                },
                "consulted": {
                    "persons": input_data["darci"]["consulted"],
                    "explanation": self.prd_maker.generate_darci_explanations("consulted", input_data["darci"]["consulted"])
                },
                "informed": {
                    "persons": input_data["darci"]["informed"],
                    "explanation": self.prd_maker.generate_darci_explanations("informed", input_data["darci"]["informed"])
                }
            },
            "project_timeline": {
                "start_date": input_data["timeline"]["start_date"],
                "end_date": input_data["timeline"]["end_date"],
                "pic": input_data["timeline"]["pic"]
            }
        }
        
        return prd

@app.route('/generate-prd', methods=['POST'])
def generate_prd():
    input_data = request.json
    prd_generator = PRDGenerator()
    prd = prd_generator.create_prd(input_data)
    
    # Save PRD to Google Cloud Storage
    bucket = storage_client.bucket(bucket_name)
    file_name = f"prd-{datetime.now().strftime('%Y%m%d%H%M%S')}.json"
    blob = bucket.blob(file_name)
    blob.upload_from_string(json.dumps(prd, indent=2), content_type='application/json')
    
    return jsonify({"message": "PRD generated and uploaded to cloud storage.", "file_name": file_name})

if __name__ == '__main__':
    app.run(port=5001, debug=True)