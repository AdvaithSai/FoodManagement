## Student Management System (Java + PostgreSQL)

This is a console-based Java CRUD application to manage student records using JDBC and PostgreSQL.

### Features
- Add a student
- Remove a student by ID
- View one student by ID
- View all students
- View all students with sorting (`id`, `name`, `age`, `course`) in `ASC` or `DESC` order

### Tech Stack
- Java (core, OOP)
- JDBC
- PostgreSQL
- PostgreSQL JDBC Driver (`lib/postgresql-42.7.9.jar`)

### Project Structure
- `Main.java`  
  Entry point and menu-driven CLI flow.
- `StudentDAO.java`  
  DAO interface declaring student operations.
- `StudentDAOImpl.java`  
  JDBC implementation of all DAO methods and SQL queries.
- `Student.java`  
  Student model (`id`, `name`, `age`, `course`), extends `Person`.
- `Person.java`  
  Base class with common fields (`name`, `age`).
- `DBConnection.java`  
  Database connection utility using PostgreSQL URL, username, and password.
- `lib/postgresql-42.7.9.jar`  
  JDBC driver dependency.

### Database Requirements
Create a PostgreSQL database and table:

```sql
CREATE DATABASE student_db;

-- connect to student_db, then:
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    course VARCHAR(100) NOT NULL
);
