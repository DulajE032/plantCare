import pytest
import os
import torch
from app.services.classifier import DiseaseClassifier

def test_classifier_initialization():
    # Verify that the classifier loads weights correctly
    classifier = DiseaseClassifier()
    assert classifier.model is not None
    assert not classifier.model.training

def test_class_names_loaded():
    from app.services.classifier import _class_names
    assert len(_class_names) == 38
    assert "Tomato___healthy" in _class_names
