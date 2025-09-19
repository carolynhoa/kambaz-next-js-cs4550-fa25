import Link from "next/link";
export default function Labs() {
 return (
   <div id="wd-labs">
     <h1>Labs</h1>
     <h2>Carolyn Hoa CS4550.11597.202610</h2>
     <h3>
  Github Repo: <Link href="https://github.com/carolynhoa/kambaz-next-js-cs4550-fa25.git">kambaz-next-js-cs4550-fa25</Link></h3>
  <ul>
       <li>
         <Link href="/Labs/Lab1" id="wd-lab1-link">
           Lab 1: HTML Examples </Link> </li>
       <li>
         <Link href="/Labs/Lab2" id="wd-lab2-link">
           Lab 2: CSS Basics </Link> </li>
       <li>
         <Link href="/Labs/Lab3" id="wd-lab3-link">
           Lab 3: JavaScript Fundamentals </Link> </li>       
       <li>
       <Link href="/" id="wd-lab3-link">
         Kambaz </Link> </li>
     </ul>
   </div>
 );}
