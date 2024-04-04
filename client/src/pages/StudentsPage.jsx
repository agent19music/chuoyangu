import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import SideMenu from '../components/SideMenu';
import {Link} from 'react-router-dom';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  // const [selectedCourse, setSelectedCourse] = useState('');
  const { apiEndpoint } = useContext(UserContext);

  // const courses = ['UI/UX', 'Data Science', 'Software Dev', 'Cybersec']; // Updated course names

   // Fetch data when component mounts

   useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/users`);
        setStudents(response.data.users); // Update state with fetched users data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [apiEndpoint]);
  

  // const filterStudentsByCourse = async (course) => {
  //   try {
  //     const response = await axios.get(`${apiEndpoint}/users/category/${course}`);
  //     setStudents(response.data.users); // Update state with filtered users data
  //     setSelectedCourse(course);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  // const addStudent = () => {
  //   // Generating random student data for demonstration
  //   const genders = ['men', 'women'];
  //   const gender = genders[Math.floor(Math.random() * genders.length)];
  //   const course = courses[Math.floor(Math.random() * courses.length)];
  //   const newStudent = {
  //     id: Math.floor(Math.random() * 1000) + 1,
  //     name: `Student ${students.length + 1}`,
  //     course: course,
  //     photo: `https://randomuser.me/api/portraits/${gender}/${Math.floor(Math.random() * 100)}.jpg`,
  //   };
  //   setStudents(prevStudents => [...prevStudents, newStudent]);
  // };

  return (
    <div className="d-flex flex-column flex-md-row align-items-start justify-content-between h-100">
      {/* Left section (15%, with sidenav on top) */}
      <div id='left-sidemenu' className="order-3 order-md-1 col-12 col-md-2 p-3 shadow-sm h-100 d-flex flex-column mt-5">
        {/* Sidebar content */}
        <nav className="collapse d-lg-block sidebar collapse h-50 overflow-auto">
          <div className="position-sticky">
            <div id="sidebarMenu" className="list-group list-group-flush mx-3 mt-4">
            <>
              <Link to="/users/category/software_dev" className="list-group-item list-group-item-action py-2 ripple text-dark link-style mb-2" aria-current="true">
              <i className="far fa-face-laugh-beam fa-fw me-3"></i><span>SoftwareDev</span>
            </Link>
            <Link to="/users/category/cybersec" className="list-group-item list-group-item-action py-2 ripple text-dark link-style mb-2">
              <i className="fas fa-calendar-days fa-fw me-3"></i><span>CyberSec</span>
            </Link>
            <Link to="/users/category/data_science" className="list-group-item list-group-item-action py-2 ripple text-dark link-style mb-2">
              <i className="fas fa-book-open fa-fw me-3"></i><span>DataScience</span>
            </Link>
            <Link to="/users/category/ui_ux" className="list-group-item list-group-item-action py-2 ripple text-dark link-style mb-2">
              <i className="fas fa-fire fa-fw me-3"></i><span>UI_UX</span>
            </Link>
              </>
              {/* <div className="mt-3">
                <h5>Courses</h5>
                <button className={`btn btn-primary me-2 ${selectedCourse === '' ? 'active' : ''}`} onClick={() => filterStudentsByCourse('')}>All Students</button>
                {courses.map(course => (
                  <button key={course} className={`btn btn-${selectedCourse === course ? 'primary' : 'secondary'} me-2`} onClick={() => filterStudentsByCourse(course)}>{course}</button>
                ))}
              </div> */}
            </div>
          </div>
        </nav>  
        <div className="mt-auto d-flex flex-column align-items-center justify-content-center">
          <h4>About</h4>
          <h3>Students Page</h3>
          <p>
            The student page provides a user-friendly interface for students to access resources and communicate with their fellow peers. Through features like funtimes and comment section, it fosters effective interaction and engagement between students and educators within the learning environment.
          </p>
          <div id='socials' className="d-flex mt-3">
            <a href="https://twitter.com" className="me-3"><i className="fab fa-twitter fa-lg"></i></a>
            <a href="https://www.instagram.com" className="me-3"><i className="fab fa-instagram fa-lg"></i></a>
            <a href="https://github.com"><i className="fab fa-github fa-lg"></i></a>
          </div>
        </div>
      </div>

      {/* Middle section (50%) */}
      <div id='middle' className="order-1 order-md-2 col-12 col-md-8 mx-2 p-3 shadow-sm">
        <h3>Students</h3>
        <div className="row">
          {students.map(student => (
            <div key={student.id} className="col-md-6 mb-3">
              <div className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
                <div className="col p-4 d-flex flex-column position-static">
                  <strong className="d-inline-block mb-2 text-primary">ID: {student.id}</strong>
                  <h3 className="mb-0">{student.username}</h3>
                  <div className="mb-1 text-muted">Course: {student.category}</div>
                </div>
                <div className="col-auto d-none d-lg-block">
                  <img src={student.image_url} alt={student.username} className="img-fluid" />
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* <div className="mt-3">
          <button className="btn btn-success" onClick={addStudent}>Add Student</button>
        </div> */}
      </div>

         {/* Right section (15%) */}
         <div id='right-sidemenu' className="order-2 order-md-3 col-12 col-md-2 mx-2 p-3 shadow-sm mt-3">
        <h4>Top Student</h4>
        <img src='https://i.pinimg.com/564x/d2/89/3e/d2893ede2bb0b124c95e95a083dbaccf.jpg' className='img-fluid' alt="Top Funtime" />
        <h5>Achievement</h5>
        <p>This student has showcased exceptional creativity and skill in developing a groundbreaking project that pushes the boundaries of innovation. Their project demonstrates ingenuity and promises to revolutionize its respective field with its inventive approach and meticulous execution.</p>
      </div>
      <div className='sidebar-btn'>
        <SideMenu mode='students' />
      </div>
    </div>
  );
}
