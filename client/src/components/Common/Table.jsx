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

  const tableRows = sampleData.map((row) => (
    <TableRow
      rowData={row}
      type={type}
      onAccept={onAccept}
      onReject={onReject}
    />
  ));

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // const indexOfLastRow = currentPage * rowsPerPage;
  // const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  // const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(sampleData.length / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // function to show page numbers
  const renderPageNumbers = () => {
    const pages = [];

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
      pages.push(
        <button
          key={1}
          onClick={() => handlePageClick(1)}
          className={`com-table-page-btn ${currentPage === 1 ? "active" : ""}`}
        >
          1
        </button>
      );

      // show ... if current page is greater than 3
      if (currentPage > 3) {
        pages.push(<span>...</span>);
      }

      // current page and next page
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

      // show ... if there are 2 more pages between current and last
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
                <th scope="col" className="appreq-col-name">
                  Name
                </th>
                <th scope="col" className="appreq-col-email">
                  Email
                </th>
                <th scope="col" className="appreq-col-date">
                  Date
                </th>
                <th scope="col" className="appreq-col-timeslot">
                  Timeslot
                </th>
                {type !== "upcoming appointment" && (
                  <th scope="col" className="appreq-col-action">
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody>{tableRows}</tbody>
            <tfoot>
              <tr>
                <td colSpan="5" className="com-table-pagination">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="com-table-page-btn"
                  >
                    &lt;
                  </button>
                  {renderPageNumbers()}
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
