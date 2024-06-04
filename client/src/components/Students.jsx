import React from 'react';
import '../App.css'; // Import CSS file for styles

const fakeStudents = [
    {
        name: "John Doe",
        age: 20,
        id: "JD12345",
        courses: ["Mathematics", "Physics", "English"],
        photo: "https://i.pinimg.com/564x/14/d6/25/14d6257e9bd68a3f1bf71e9960542e1f.jpg"
    },
    {
        name: "Jane Smith",
        age: 22,
        id: "JS54321",
        courses: ["Computer Science", "History", "Psychology"],
        photo: "https://i.pinimg.com/564x/14/d6/25/14d6257e9bd68a3f1bf71e9960542e1f.jpg"
    },
    {
        name: "Alice Johnson",
        age: 21,
        id: "AJ98765",
        courses: ["Biology", "Chemistry", "Art"],
        photo: "https://i.pinimg.com/564x/14/d6/25/14d6257e9bd68a3f1bf71e9960542e1f.jpg"
    },
    {
        name: "Bob Brown",
        age: 19,
        id: "BB24680",
        courses: ["Economics", "Sociology", "Political Science"],
        photo: "https://i.pinimg.com/564x/14/d6/25/14d6257e9bd68a3f1bf71e9960542e1f.jpg"
    }
    // Add more students as needed
];

function Student() {
    return (
        <div className="container text-center">
            <div className="row">
                <h1 className="title">Student Information</h1>
            </div>
            <div className="row">
                {fakeStudents.map((student, index) => (
                    <div key={index} className="col align-self-center">
                        <div className="row">
                            <div className="col-md-4">
                                <img src={`data:image/jpeg;base64,${student.photo}`} alt={student.name} className="student-photo" />
                            </div>
                            <div className="col-md-8">
                                <h2>Name: {student.name}</h2>
                                <p>ID: {student.id}</p>
                                <p>Courses: {student.courses.join(", ")}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Student;
