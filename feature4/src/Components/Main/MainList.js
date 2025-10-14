/* STATEFUL PARENT COMPONENT */
const MainList = ({ lessons }) => {
  return (
    <div>
      <hr />
      This is the main list stateless child component.
      <div>
        <p> Lesson by ID: </p>
        {/* Check that the lesson object exists */}
        {lessons.length > 0 && (
          <ul>
            {/* Using getter for lesson Object to display name */}
            {lessons.map((lesson) => (
              <li key={lesson.id}>
                {" "}
                {lesson.id} | {lesson.get("name")}{" "}
              </li>
            ))}
          </ul>
        )}
      </div>{" "}
    </div>
  );
};

export default MainList;
