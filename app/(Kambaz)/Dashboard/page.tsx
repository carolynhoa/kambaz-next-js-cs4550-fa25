import Link from "next/link";
import Image from "next/image";
import {Col, Row, Card, CardImg, CardBody, CardTitle, CardText, Button} from "react-bootstrap";
export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (7)</h2> <hr />
      <div id="wd-dashboard-courses">
      <Row xs={1} md={5} className="g-4">
      <Col className="wd-dashboard-course" style={{ width: "300px" }}>
        <Card>
          <Link href="/Courses/1234" 
          className="wd-dashboard-course-link text-decoration-none text-dark">
            <CardImg variant="top" src="/images/reactjs.jpg" width={200} height={150} alt="React logo"/>
            <CardBody>
            <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS1234 React JS</CardTitle>
            <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
              Full Stack software developer</CardText>
            <Button variant="primary">Go</Button>
            </CardBody>
          </Link>
          </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
        <Card>
          <Link href="/Courses/2345"
          className="wd-dashboard-course-link text-decoration-none text-dark">
            <CardImg variant="top" src="/images/webdev.jpg" width={200} height={150} alt="Web Dev logo"/>
            <CardBody>
            <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS2345 Web Development</CardTitle>
            <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                  Web developer</CardText>
            <Button variant="primary">Go</Button>
            </CardBody>
          </Link>
          </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
        <Card>
          <Link href="/Courses/3456"
          className="wd-dashboard-course-link text-decoration-none text-dark">
            <CardImg variant="top" src="/images/ood.jpg" width={200} height={150} alt="Object Oriented Programming logo"/>
            <CardBody>
            <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS3456 Object Oriented Design</CardTitle>
            <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
              Object Oriented Programming</CardText>
            <Button variant="primary">Go</Button>
            </CardBody>
          </Link>
          </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
        <Card>
          <Link href="/Courses/4567"
          className="wd-dashboard-course-link text-decoration-none text-dark">
            <CardImg variant="top" src="/images/algo.jpg" width={200} height={150} alt="Algo logo"/>
            <CardBody>
            <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS4567 Algorithms</CardTitle>
            <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
            Algorithms and Data structures</CardText>
            <Button variant="primary">Go</Button>
            </CardBody>
          </Link>
          </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
        <Card>
          <Link href="/Courses/5678"
          className="wd-dashboard-course-link text-decoration-none text-dark">
            <CardImg variant="top" src="/images/database.jpg" width={200} height={150} alt="Database logo"/>
            <CardBody>
            <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS5678 Databases</CardTitle>
            <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
            Database and design</CardText>
            <Button variant="primary">Go</Button>
            </CardBody>
          </Link>
          </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
        <Card>
          <Link href="/Courses/6789"
          className="wd-dashboard-course-link text-decoration-none text-dark">
            <CardImg variant="top" src="/images/datascience.jpg" width={200} height={150} alt="Data science logo"/>
            <CardBody>
            <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS6789 Data Science</CardTitle>
            <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
            Introduction to data science</CardText>
            <Button variant="primary">Go</Button>
            </CardBody>
          </Link>
          </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
        <Card>
          <Link href="/Courses/7891"
          className="wd-dashboard-course-link text-decoration-none text-dark">
            <CardImg variant="top" src="/images/systems.jpg" width={200} height={150} alt="Computer systems logo"/>
            <CardBody>
            <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS7891 Systems</CardTitle>
            <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
            Computer systems and assembly</CardText>
            <Button variant="primary">Go</Button>
            </CardBody>
          </Link>
          </Card>
          </Col>
          </Row>
      </div>
    </div>
);}
