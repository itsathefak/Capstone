import React, { useState } from "react";
import TableRow from "./TableRow";

function Table({ type, data, onAccept, onReject }) {
  let sampleData = [
    {
      name: "John Doe",
      email: "john.doe@gmail.com",
      date: "03-25-2024",
      timeslot: "11:00-12:00",
    },
    {
      name: "John Doe",
      email: "john.doe@gmail.com",
      date: "03-25-2024",
      timeslot: "11:00-12:00",
    },
    {
      name: "John Doe",
      email: "john.doe@gmail.com",
      date: "03-25-2024",
      timeslot: "11:00-12:00",
    },
    {
      name: "John Doe",
      email: "john.doe@gmail.com",
      date: "03-25-2024",
      timeslot: "11:00-12:00",
    },
  ];

  // Instantiate the table row component for each record in the table
  const tableRows = data.map((row) => (
    <TableRow
      rowData={row}
      type={type}
      onAccept={onAccept}
      onReject={onReject}
    />
  ));

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const totalPages = Math.ceil(data.length / rowsPerPage);

  // function to move one page forward
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // function to move one page behind
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // function to move to the page number clicked
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // function to show page numbers
  const renderPageNumbers = () => {
    const pages = [];

    // if total pages are less than 3, show all page numbers
    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageClick(i)}
            className={`com-table-page-btn ${
              currentPage === i ? "active" : ""
            }`}
          >
            {i}
          </button>
        );
      }
    } else {
      // first page
      pages.push(
        <button
          key={1}
          onClick={() => handlePageClick(1)}
          className={`com-table-page-btn ${currentPage === 1 ? "active" : ""}`}
        >
          1
        </button>
      );

      // show ... if there are more than 2 pages between current page and first
      if (currentPage > 3) {
        pages.push(<span>...</span>);
      }

      // previous, current and next page
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageClick(i)}
            className={`com-table-page-btn ${
              currentPage === i ? "active" : ""
            }`}
          >
            {i}
          </button>
        );
      }

      // show ... if there are more than 2 pages between current and last
      if (currentPage < totalPages - 2) {
        pages.push(<span>...</span>);
      }

      // last page
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageClick(totalPages)}
          className={`com-table-page-btn ${
            currentPage === totalPages ? "active" : ""
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="">
      <div className="">
        <div className="">
          <table className="com-table">
            <thead className="">
              <tr>
                {type === "appointment history" ? (
                  <>
                    <th scope="col" className="com-col com-col-name">
                      Service Name
                    </th>
                    <th scope="col" className="com-col com-col-name">
                      Provider Name
                    </th>
                    <th scope="col" className="com-col com-col-email">
                      Provider Email
                    </th>
                  </>
                ) : (
                  <>
                    <th
                      scope="col"
                      className={`com-col ${
                        type === "appointment requests" ? "appreq-col-name" : "com-col-name"
                      }`}
                    >
                      Name
                    </th>
                    <th scope="col" className={`com-col ${
                        type === "appointment requests" ? "appreq-col-email" : "com-col-email"
                      }`}>
                      Email
                    </th>
                    <th scope="col" className={`com-col ${
                        type === "appointment requests" ? "appreq-col-name" : "com-col-name"
                      }`}>
                      Service Name
                    </th>
                  </>
                )}

                <th scope="col" className={`com-col ${
                        type === "appointment requests" ? "appreq-col-date" : "com-col-date"
                      }`}>
                  Date
                </th>
                <th scope="col" className={`com-col ${
                        type === "appointment requests" ? "appreq-col-time" : "com-col-time"
                      }`}>
                  Timeslot
                </th>

                {/* hide/show actions column based on the type of table */}
                {type === "appointment requests" && (
                  <th scope="col" className="com-col appreq-col-action">
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody>{tableRows}</tbody>
            <tfoot>
              <tr>
                <td colSpan={type === "appointment requests" ? 6 : 5} className="com-table-pagination">
                  {/* previous btn disabled if current page is 1 */}
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="com-table-page-btn"
                  >
                    &lt;
                  </button>
                  {renderPageNumbers()}
                  {/* next btn disabled if current page is last */}
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="com-table-page-btn"
                  >
                    &gt;
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Table;
