import Link from "next/link";
import Image from "next/image";
export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (12)</h2> <hr />
      <div id="wd-dashboard-courses">
        <div className="wd-dashboard-course">
          <Link href="/Courses/1234" className="wd-dashboard-course-link">
            <Image src="/images/reactjs.jpg" width={200} height={150} alt="React logo"/>
            <div>
              <h5> CS1234 React JS </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course"> 
        <Link href="/Courses/2345" className="wd-dashboard-course-link">
            <Image src="/images/webdev.jpg" width={200} height={150} alt="Web Dev logo"/>
            <div>
              <h5> CS2345 Web Development </h5>
              <p className="wd-dashboard-course-title">
                Web developer
              </p>
              <button> Go </button>
              </div>
          </Link>
               </div>
               <div className="wd-dashboard-course"> 
        <Link href="/Courses/3456" className="wd-dashboard-course-link">
            <Image src="/images/ood.jpg" width={200} height={150} alt="Object Oriented Programming logo"/>
            <div>
              <h5> CS3456 Object Oriented Design </h5>
              <p className="wd-dashboard-course-title">
                Object Oriented Programming
              </p>
              <button> Go </button>
              </div>
          </Link>
               </div>
               <div className="wd-dashboard-course"> 
        <Link href="/Courses/4567" className="wd-dashboard-course-link">
            <Image src="/images/algo.jpg" width={200} height={150} alt="Algo logo"/>
            <div>
              <h5> CS4567 Algorithms </h5>
              <p className="wd-dashboard-course-title">
                Algorithms and Data structures
              </p>
              <button> Go </button>
              </div>
          </Link>
               </div>
               <div className="wd-dashboard-course"> 
        <Link href="/Courses/5678" className="wd-dashboard-course-link">
            <Image src="/images/database.jpg" width={200} height={150} alt="Database logo"/>
            <div>
              <h5> CS5678 Databases </h5>
              <p className="wd-dashboard-course-title">
                Database and design
              </p>
              <button> Go </button>
              </div>
          </Link>
               </div>
               <div className="wd-dashboard-course"> 
        <Link href="/Courses/6789" className="wd-dashboard-course-link">
            <Image src="/images/datascience.jpg" width={200} height={150} alt="Data science logo"/>
            <div>
              <h5> CS6789 Data Science </h5>
              <p className="wd-dashboard-course-title">
                Introduction to data science
              </p>
              <button> Go </button>
              </div>
          </Link>
               </div>
               <div className="wd-dashboard-course"> 
        <Link href="/Courses/7891" className="wd-dashboard-course-link">
            <Image src="/images/systems.jpg" width={200} height={150} alt="Computer systems logo"/>
            <div>
              <h5> CS7891 Systems </h5>
              <p className="wd-dashboard-course-title">
                Computer systems and assembly
              </p>
              <button> Go </button>
              </div>
          </Link>
               </div>
      </div>
    </div>
);}
