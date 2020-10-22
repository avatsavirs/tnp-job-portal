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
- [x] Finish Student Model
- [ ] Finish Student Routes🛣
- [ ] Add file upload(Resume)
- [ ] Finish Student Controllers
- [x] Add Student Profile Validation✅
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
        "_id",
        "name",
        "email",
        "applications",
        "createdAt",
        "updatedAt",
        "__v",
        "profile": {
            "workDetails": [{
              "companyName",
              "startedOn",
              "workType"
            }],
            "projectDetails": [
                {
                    "name",
                    "description",
                    "githubUrl"
                }
            ],
            "certifications": [],
            "address": {
                "addrLine1",
                "addrLine2",
                "city",
                "state",
                "country",
                "pincode"
            },
            "educationDetails": {
                "classX": {
                    "schoolName",
                    "marks",
                    "passingYear",
                    "marksType"
                },
                "classXII": {
                    "schoolName",
                    "marks",
                    "passingYear",
                    "marksType"
                },
                "college": {
                    "branch",
                    "cgpa",
                    "passingYear"
                }
            }
        }
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
      "name": "required, only alphabets and spaces",
      "loginId": "required, Only kiit email id eg. 1705500@kiit.ac.in",
      "password": "required, min 8 characters, atleast 1 uppercase, 1 lowercase, 1 number, 1 special characters",
      "profile": "not required"
    }
    ```
  - success:
    ```json
    {
      "message": "Signup successful",
      "data": {
        "token"
      }
    }
    ```
  - error:
    ```json
    {
      "message": "Signup Failed",
      "errors": [
        {
          "field",
          "message"
        }
      ]
    }
    ```

- POST /signin/student/
  - request:
    ```json
    {
      "loginId": "required, kiit email id. eg. 1705500@kiit.ac.in",
      "password": "required"
    }
    ```
  - success:
    ```json
    {
      "message": "Signin Successful ",
      "data": {
        "token"
      }
    }
    ```
  - error:
    ```json
    {
      "message": "Signin failed",
      "error": [
        {"field", "message"}
      ]
    }
    ```
- POST /student/profile/
    - request:
    ```json
    {
      "address": {
          "addrLine1": "required",
          "addrLine2": "required",
          "city": "required, only spaces and letters",
          "state":  "required, only spaces and letters",
          "country": "required, only spaces and letters",
          "pincode": "required, only 6 digit numbers"
      }: "required",
      "educationDetails": {
          "classX": {
              "schoolName": "required, Only alphabets, spaces and period(.) allowed",
              "marksType": "required, enum: CGPA/PER",
              "marks": "required, number, max: 100",
              "passingYear": "yyyy format"
          },
          "classXII": {
              "schoolName": "required, Only alphabets, spaces and period(.) allowed",
              "marksType": "required, enum: CGPA/PER",
              "marks": "required, number, max: 100",
              "passingYear": "yyyy format"
          },
          "college": {
              "branch": "required, only alphabets and spaces",
              "cgpa": "required, max value 10",
              "passingYear": "yyyy format"
          }
      },
      "workDetails": [{
          "companyName": "required, alphabets, spaces and period(.) allowed",
          "startedOn": "required, valid date format",
          "endedOn": "not required, valid date format",
          "workType": "required, enum: IN/PT/FT"
      }],
      "projectDetails": [{
          "name": "required, alphabets, spaces, periods(.), and hyphens(-) allowed",
          "githubUrl": "required, must be a valid url starting with http/https",
          "description": "required"
      }],
      "certifications": [{
        "name": "required, alphabets and spaces allowed",
        "url": "required, must be a valid url starting with http/https",
        "date": "required, valid date format"
      }]
    }
    ```
