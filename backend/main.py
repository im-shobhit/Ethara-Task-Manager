# backend/main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from datetime import timedelta
from jose import JWTError, jwt

import models, schemas, security
from database import engine, get_db

# 1. Automatically create the database tables
models.Base.metadata.create_all(bind=engine)

# 2. Initialize FastAPI app
app = FastAPI(title="Team Task Manager API")

# 3. Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- SECURITY GUARD (Checks JWT Tokens) ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, security.SECRET_KEY, algorithms=[security.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

# --- AUTH ROUTES ---
@app.get("/")
def read_root():
    return {"message": "Welcome to the Team Task Manager API!"}

@app.post("/signup", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_pw = security.get_password_hash(user.password)
    new_user = models.User(username=user.username, hashed_password=hashed_pw, role=user.role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.username, "role": user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "role": user.role}

# --- SECURE APP ROUTES (Requires Login) ---

@app.post("/projects", response_model=schemas.Project)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create projects")
    new_project = models.Project(name=project.name, description=project.description, owner_id=current_user.id)
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

@app.get("/projects", response_model=list[schemas.Project])
def get_projects(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Project).all()

@app.post("/tasks", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create tasks")
    new_task = models.Task(**task.model_dump()) 
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@app.get("/tasks", response_model=list[schemas.Task])
def get_tasks(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Role-Based Access: Admins see all tasks. Members see only their assigned tasks.
    if current_user.role == "admin":
        return db.query(models.Task).all()
    return db.query(models.Task).filter(models.Task.assignee_id == current_user.id).all()

@app.put("/tasks/{task_id}/status")
def update_task_status(task_id: int, status: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Ensure members can only update tasks assigned to them
    if current_user.role != "admin" and task.assignee_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this task")
    
    task.status = status
    db.commit()
    db.refresh(task)
    return task