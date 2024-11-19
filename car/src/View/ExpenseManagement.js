import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../CSS/ExpenseManagement.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useAuth } from "../Component/AuthContext";

const ExpenseManagement = () => {
  const { authState } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentRows, setCurrentRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchExpenses = useCallback(async () => {
    try {
      const response = await axios.get(`https://hizenberk.pythonanywhere.com/api/expenses/`, {
        headers: {
          Authorization: `Bearer ${authState.access}`,
        },
      });
      if (response.status === 200) {
        const updatedExpenses = response.data.expenses.map(expense => ({
          ...expense,
          status: expense.status || "pending",
          receipt_detail: expense.receipt_detail 
            ? (expense.receipt_detail.startsWith("http") 
                ? expense.receipt_detail 
                : `https://hizenberk.pythonanywhere.com${expense.receipt_detail}`)
            : null,
        }));
        setExpenses(updatedExpenses);
        updateCurrentRows(updatedExpenses);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  }, [authState.access]);

  useEffect(() => {
    if (authState.access) {
      fetchExpenses();
    }
  }, [authState.access, fetchExpenses]);

  const translateStatus = (status) => {
    switch (status) {
      case "approved":
        return "승인";
      case "pending":
        return "대기";
      case "rejected":
        return "반려";
      default:
        return status;
    }
  };

  const translateStatusToEnglish = (status) => {
    switch (status) {
      case "승인":
        return "approved";
      case "대기":
        return "pending";
      case "반려":
        return "rejected";
      default:
        return status;
    }
  };

  const updateExpenseStatus = async (id, newStatus) => {
    const updatedExpenses = expenses.map((expense) =>
      expense.id === id ? { ...expense, status: newStatus } : expense
    );
    setExpenses(updatedExpenses);
    updateCurrentRows(updatedExpenses);

    try {
      const response = await axios.patch(
        `https://hizenberk.pythonanywhere.com/api/expenses/${id}/`,
        { status: translateStatusToEnglish(newStatus) },
        {
          headers: {
            Authorization: `Bearer ${authState.access}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Server response received:", response.data);
        closeModal()
      }
    } catch (error) {
      console.error("Error updating status:", error);
      const revertedExpenses = expenses.map((expense) =>
        expense.id === id ? { ...expense, status: expense.status } : expense
      );
      setExpenses(revertedExpenses);
      updateCurrentRows(revertedExpenses);
    }
  };

  const deleteExpense = async (id) => {
    console.log("Attempting to delete expense with ID:", id);
    try {
      const response = await axios.delete(`https://hizenberk.pythonanywhere.com/api/expenses/${id}/`, {
        headers: {
          Authorization: `Bearer ${authState.access}`,
        },
      });

      if (response.status === 204) {
        console.log("Expense deleted successfully");
        const updatedExpenses = expenses.filter((expense) => expense.id !== id);
        setExpenses(updatedExpenses);
        updateCurrentRows(updatedExpenses);
      } else {
        console.error("Unexpected response:", response.status);
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const updateCurrentRows = (filteredExpenses) => {
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const filteredRows = filteredExpenses
      .filter((expense) => {
        if (!searchTerm) return true;
        return expense.details.toLowerCase().includes(searchTerm.toLowerCase());
      })
      .slice(indexOfFirstRow, indexOfLastRow);
    setCurrentRows(filteredRows);
  };

  useEffect(() => {
    updateCurrentRows(expenses);
  }, [expenses, currentPage, rowsPerPage, searchTerm]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(expenses.length / rowsPerPage);

  const countStatus = (status) => expenses.filter((expense) => translateStatus(expense.status) === status).length;

  const openModal = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRow(null);
    setIsModalOpen(false);
  };

  return (
    <div className="expense-management">
      <div className="expense-management-background">
        <div className="expense-management-top-box">
          <p className="expense-management-top-title">지출 내역</p>
          <div className="filters">
            <button className="filter-btn">전체({expenses.length})</button>
            <button className="filter-btn">승인({countStatus("승인")})</button>
            <button className="filter-btn">대기({countStatus("대기")})</button>
            <button className="filter-btn">반려({countStatus("반려")})</button>
          </div>
        </div>

        <div className="expense-management-a-box">
          <div className="expense-management-b-box">
            <select className="rows-per-page" value={rowsPerPage} onChange={handleRowsPerPageChange}>
              <option value="10">10개씩 보기</option>
              <option value="20">20개씩 보기</option>
              <option value="30">30개씩 보기</option>
            </select>
            <input
              type="text"
              className="expense-management-search-box"
              placeholder="검색..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <table className="expense-table">
            <thead>
              <tr>
                <th>구분</th>
                <th>지출 일자</th>
                <th>상태</th>
                <th>사용자</th>
                <th>차량</th>
                <th>지출 및 정비/상세 내역</th>
                <th>결제 수단</th>
                <th>금액</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length > 0 ? currentRows.map((expense) => (
                <tr key={expense.id} onClick={() => openModal(expense)}>
                  <td>{expense.expense_type}</td>
                  <td>{expense.expense_date}</td>
                  <td>
                    <span>{translateStatus(expense.status)}</span>
                  </td>
                  <td>{expense.user_info.name}</td>
                  <td>{expense.vehicle_info.license_plate_number}</td>
                  <td>{expense.details}</td>
                  <td>{expense.payment_method}</td>
                  <td>{expense.amount}</td>
                  <td>
                    <button className="expensemanagement-delete-btn" onClick={(e) => { e.stopPropagation(); deleteExpense(expense.id); }}>삭제</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="9">데이터가 없습니다.</td></tr>
              )}
            </tbody>
          </table>

          <div className="pagination">
            <button
              className="page-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="page-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && selectedRow && (
        <div className="expensemanagement-modal-overlay" onClick={closeModal}>
          <div className="expensemanagement-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="expensemanagement-modal-top-box">
              <div className="expensemanagement-modal-return-box" onClick={closeModal}>
                <i className="bi bi-arrow-return-left"></i>
                <span>뒤로 가기</span>
              </div>
              <h2>차량번호 ({selectedRow.vehicle_info.license_plate_number})</h2>
            </div>
            <div className="expensemanagement-modal-a-box">
              <div className="expensemanagement-modal-fields">
                <div className="expensemanagement-modal-body-box">
                  <label>지출항목:</label> <input className="expensemanagement-input-4" type="text" value={selectedRow.details} readOnly />
                </div>
                <div className="expensemanagement-modal-body-box">
                  <label>상태:</label> <input className="expensemanagement-input-2" type="text" value={translateStatus(selectedRow.status)} readOnly />
                </div>
                <div className="expensemanagement-modal-body-box">
                  <label>지출일자:</label> <input className="expensemanagement-input-4" type="text" value={selectedRow.expense_date} readOnly />
                </div>
                <div className="expensemanagement-modal-body-box">
                  <label>사용자:</label> <input className="expensemanagement-input-3" type="text" value={selectedRow.user_info.name} readOnly />
                </div>
                <div className="expensemanagement-modal-body-box">
                  <label>차량:</label> <input className="expensemanagement-input-3" type="text" value={selectedRow.vehicle_info.license_plate_number} readOnly />
                </div>
                <div className="expensemanagement-modal-body-box">
                  <label>결제수단:</label> <input className="expensemanagement-input-4" type="text" value={selectedRow.payment_method} readOnly />
                </div>
              </div>
              <div className="expensemanaegement-modal-receipt-a-box">
              <div className="expensemanagement-modal-receipt-box">
                {selectedRow.receipt_detail ? (
                  <img
                    src={selectedRow.receipt_detail}
                    alt="Receipt"
                    className="expensemanagement-receipt-image"
                    style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
                  />
                ) : (
                  <p>영수증 이미지가 없습니다.</p>
                )}
              </div>
              <div className="expensemanagement-modal-buttons">
              <button
                className="approve-btn"
                onClick={() => updateExpenseStatus(selectedRow.id, "승인")}
              >
                승인
              </button>
              <button
                className="reject-btn"
                onClick={() => updateExpenseStatus(selectedRow.id, "반려")}
              >
                반려
              </button>
            </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseManagement;
