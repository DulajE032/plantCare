from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello from the backend this is a simple API!"}

def create_app():
    return app

