import torch
import torch.nn as nn
from panns_inference import AudioTagging # Pre-installed via pip

class MusicBrain:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            print("🧠 Initializing Neural Engine...")
            cls._instance = super(MusicBrain, cls).__new__(cls)
            
            # 1. Determine Device (Mac Specialization)
            if torch.backends.mps.is_available():
                cls._instance.device = torch.device("mps")
                print("🚀 Using Apple Silicon (Metal) for Inference")
            else:
                cls._instance.device = torch.device("cpu")
                print("💻 Using CPU for Inference")

            # 2. Load the Cnn14 Architecture
            # Note: After training, you'll point 'checkpoint_path' to your custom .pth
            cls._instance.model = AudioTagging(
                checkpoint_path=None, # Defaults to pretrained AudioSet weights for now
                device=cls._instance.device
            )
            
        return cls._instance

# Export a single instance to be used across the app
brain = MusicBrain()