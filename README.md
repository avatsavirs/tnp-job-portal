# Tnp Portal

A portal for the students of KIIT university where they can save their details and apply for companies with single click instead of filling out google forms again and again.
This is also have an admin portal for the TnP department to easily add new job postings and collect data about the students who have applied for a given company.

## Setup

- clone this repo
- npm install
- npm run dev

## ToDo

- [x] Create ToDo 📝
- [x] Create student resource 👨‍🎓
- [x] Add Student Authentication 🔒
- [x] Add Student Authentication Validation ✅
- [ ] Finish Student Model
- [ ] Finish Student Routes
- [ ] Create tnp (admin) resource 🏢
- [ ] Add tnp(admin) Authentication 🔒
- [ ] Create job resource 👷

## API

- GET /student/

  - success:

    ```json
    {
      "message": "current user fetched",
      "data": {
        "_id": "5f5340f57b355a96424e4209",
        "name": "Ishan Jaiswal",
        "rollNumber": 1705500,
        "createdAt": "2020-09-05T07:40:43.137Z",
        "updatedAt": "2020-09-05T07:40:43.137Z",
        "__v": 0
      }
    }
    ```

  - error:
    ```json
    {
      "message": "Unauthorized Access"
    }
    ```

- POST /signup/student

  - request:
    ```json
    {
      "name": "Ishan Jaiswal",
      "loginId": "1705500@kiit.ac.in",
      "password": "Test@12345"
    }
    ```
  - success:
    ```json
    {
      "message": "Signup successful ",
      "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNTM0ZjdkNDNiZmVjYzJlMTc4NjZmOCIsImlhdCI6MTU5OTI5NTM1NywiZXhwIjoxNjA3OTM1MzU3fQ.AD5SH1PSNUMn60BC6pMvcJdOkCxxxxxxxxxxxxxxxxx"
      }
    }
    ```
  - error:
    ```json
    {
      "message": "Signup Failed",
      "errors": [
        /*array of objects {field, error_message}*/
      ]
    }
    ```

- POST /signin/student/
  - request:
    ```json
    {
      "loginId": "1705500@kiit.ac.in",
      "password": "Test@12345"
    }
    ```
  - success:
    ```json
    {
      "message": "Signin Successful ",
      "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNTM0ZjdkNDNiZmVjYzJlMTc4NjZmOCIsImlhdCI6MTU5OTI5NTM1NywiZXhwIjoxNjA3OTM1MzU3fQ.AD5SH1PSNUMn60BC6pMvcJdOkCQjAdFhufDFEHBbZVc"
      }
    }
    ```
  - error:
    ```json
    {
      "message": "Error: Student with loginId ${loginId} not found"
    }
    ```
  - error:
    ```json
    {
      "message": "Error: loginId/password missing"
    }
    ```
  - error:
    ```json
    {
      "message": "Invalid Password"
    }
    ```
