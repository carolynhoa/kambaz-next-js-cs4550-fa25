"use client";

export default function ProjectInfoPage() {
  return (
    <div className="container mt-4" style={{ maxWidth: "800px" }}>
      <h2 className="mb-4">Kambaz Quizzes Final Project</h2>

      <div className="p-3 border rounded bg-light">

        <h4 className="mb-3">Team Member</h4>
        <p className="mb-1">
          <b>Name:</b> Carolyn Hoa
        </p>
        <p className="mb-3">
          <b>Course Section:</b> CS4550.11597.202610
        </p>

        <h4 className="mt-4 mb-2">GitHub Repositories</h4>
        <ul>
          <li>
            <a
              href="https://github.com/carolynhoa/kambaz-next-js-cs4550-fa25/tree/quizzes"
              target="_blank"
            >
              Frontend Repository
            </a>
          </li>

          <li>
            <a
              href="https://github.com/carolynhoa/-kambaz-node-server-app/tree/quizzes"
              target="_blank"
            >
              Backend Repository
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
